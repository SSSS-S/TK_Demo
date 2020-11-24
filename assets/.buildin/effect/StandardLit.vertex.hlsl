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

  LIGHTMAP_COORDS(6)
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

void Main(in FEffect3DVertexInput In, out FVertexOutput Out)
{
  FVertexProcessOutput Skin;
  Effect3DVertexProcess(In, Skin);

  float4 positionWS = ObjectToWorldPosition(Skin.Position);
  Out.positionWS = positionWS;
  Out.position = WorldToClipPosition(positionWS);
  Out.TexCoord0 = TRANSFER_TEXCOORD(In.TexCoord, _MainTex_ST);
  Out.normalWS = ObjectToWorldNormal(Skin.Normal);
  
  Out.viewDirWS = SafeNormalize(WorldSpaceViewPosition - positionWS.xyz);
   
  #if defined(USE_NORMALMAP)
    Out.tangentWS = ObjectToWorldNormal(Skin.Tangent.xyz);
    Out.bitangentWS = cross(Out.tangentWS, Out.normalWS) * Skin.Tangent.w;
  #endif

  TRANSFER_LIGHTMAP(In, Out);
  TRANSFER_SHADOW(Out, positionWS.xyz);
  TRANSFER_FOG(Out, positionWS.xyz);
}
