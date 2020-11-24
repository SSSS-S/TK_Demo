#include <common.inc>

struct FVertexOutput
{
  float4 position : SV_Position;
  float2 TexCoord0 : TEXCOORD0;
  float4 positionWS: TEXCOORD1;
  float3 normalWS: TEXCOORD2;
  float3 viewDirWS: TEXCOORD3;

  #if defined(USE_NORMALMAP)
    float3 tangentWS: TEXCOORD4;
    float3 bitangentWS: TEXCOORD5;
  #endif

  FOG_COORDS(7)
  SHADOW_COORDS(8)
};


cbuffer Material
{
  float4 _Color;
  float _Smoothness;
  float4 _EmissionColor;
  float _Cutoff;
  float4 _MainTex_ST;
}

DECLARE_TEXTURE(_MainTex);
DECLARE_TEXTURE(_NormalMap);
DECLARE_TEXTURE(_MetallicGlossMap);
DECLARE_TEXTURE(_OcclusionMap);
DECLARE_TEXTURE(_EmissionMap);

half3 ReadNormal(half4 color)
{
  half2 normalxy = (color.rg - 0.5f) * 2.0f;
  half normalz = sqrt(max(1e-3, 1.0f - dot(normalxy, normalxy)));
  return half3(normalxy, normalz);
}


void InitializeSurfaceData(fixed2 uv, out SurfaceData surfaceData){
  // base color and alpha
  fixed4 albedo =  SAMPLE_TEXTURE(_MainTex, uv);
  albedo = albedo * _Color;
  surfaceData.baseColor = albedo.xyz;	
  
  // alpha		
  surfaceData.alpha = albedo.a;
  #if USE_ALPHA_TEST
    clip(surfaceData.alpha - _Cutoff);
  #endif
  
  // metallic工作流
  #if defined(USE_METALLICMAP)
    fixed4 metallicGloss = SAMPLE_TEXTURE(_MetallicGlossMap, uv);
    surfaceData.metallic = metallicGloss.r;
    surfaceData.smoothness = metallicGloss.a;
  #else
    surfaceData.metallic = 0.0;
    surfaceData.smoothness = 0.5;
  #endif

  surfaceData.smoothness *= _Smoothness;
  
  surfaceData.specular = fixed3(0, 0, 0);
  
  // normal
  #if defined(USE_NORMALMAP)
    fixed3 normal = ReadNormal(SAMPLE_TEXTURE(_NormalMap, uv));
    surfaceData.normalTS = normal;
  #else
    surfaceData.normalTS = half3(0, 0, 1);
  #endif

  // occulusion
  #if defined(USE_OCCLUTIONMAP)
    surfaceData.occlusion = SAMPLE_TEXTURE(_OcclusionMap, uv).r;
  #else
    surfaceData.occlusion = 1.0;
  #endif
  
  // emission
  #if defined(USE_EMISSIONMAP)
    fixed4 emissionTexColor = SAMPLE_TEXTURE(_EmissionMap, uv);
    surfaceData.emission = _EmissionColor.rgb * emissionTexColor.rgb;
  #else 
    surfaceData.emission = fixed3(0, 0, 0);
  #endif
  
}

void InitializePixelInput(FVertexOutput input, fixed3 normalTS, out PixelInput pixelInput){
  
  pixelInput = (PixelInput)0;

  pixelInput.positionWS = input.positionWS.xyz;
  pixelInput.viewDirWS = SafeNormalize(input.viewDirWS);

  #if defined(USE_NORMALMAP)
    half3x3 TBN = half3x3(input.tangentWS, input.bitangentWS, input.normalWS);
    pixelInput.normalWS = TransformTangentToWorld(normalTS, TBN);
  #else
    pixelInput.normalWS = input.normalWS;
  #endif

  // GI
  pixelInput.bakedGI = fixed3(0, 0, 0);

}

float4 Main(in FVertexOutput In) : SV_Target0
{
  SurfaceData surfaceData;
  InitializeSurfaceData(In.TexCoord0, surfaceData);

  PixelInput pixelInput;
  InitializePixelInput(In, surfaceData.normalTS, pixelInput);

  BRDFData brdfData;
  InitializeBRDFData(surfaceData, brdfData);
  
  float attenuation = SHADOW_ATTENUATION(In);
  
  fixed3 lighting = fixed3(0, 0, 0);
  for (int i = 0; i < MAX_LIGHT_NUM; i++)
  {
      if (i < LIGHT_NUM)
      {
        Light light = GetAdditionalLight(i, In.positionWS.xyz);
        lighting += PhysicallyBasedLighting(brdfData, light.color, light.direction, attenuation * light.attenuation, pixelInput.normalWS,  pixelInput.viewDirWS);
      } 
  }

  fixed4 color = fixed4(lighting, surfaceData.alpha);

  APPLY_FOG(In, color);

  return color;
}