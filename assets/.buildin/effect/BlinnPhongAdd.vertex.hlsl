#include <common.inc>

struct FVertexOutput
{
	float4 Position : SV_Position;
	float2 TexCoord : TEXCOORD0;
	float3 ViewDir : TEXCOORD1;
	float3 normalWS: TEXCOORD2;
	float4 positionWS: TEXCOORD3;
	FOG_COORDS(4)
	SHADOW_COORDS(5)
#if defined(USE_NORMALMAP)
	float3 tangentWS: TEXCOORD6;
	float3 bitangentWS: TEXCOORD7;
#endif
};

cbuffer Material
{
	float3 _SpecColor;
	float _Shininess;
	float4 _Color;
	float _AlbedoIntensity;
	float4 _EmissionColor;
	float _Cutoff;
	float4 _MainTex_ST;
}

void Main(in FEffect3DVertexInput In, out FVertexOutput Out)
{
	FVertexProcessOutput Skin;
	Effect3DVertexProcess(In, Skin);

	Out.TexCoord = TRANSFER_TEXCOORD(In.TexCoord, _MainTex_ST);

	float4 worldPosition = ObjectToWorldPosition(Skin.Position);
	Out.positionWS = worldPosition;
	Out.Position = WorldToClipPosition(worldPosition);

	Out.ViewDir = normalize(WorldSpaceViewPosition - worldPosition.xyz);
	float3 normalWS = ObjectToWorldNormal(Skin.Normal);
	Out.normalWS = normalWS;

#if defined(USE_NORMALMAP)
	// 法线贴图模式，定义TBN矩阵
	float3 tangentWS = ObjectToWorldNormal(Skin.Tangent.xyz);
	float3 bitangentWS = cross(tangentWS, normalWS) * Skin.Tangent.w;
	Out.tangentWS = tangentWS;
	Out.bitangentWS = bitangentWS;
#endif

	TRANSFER_SHADOW(Out, worldPosition.xyz);
	TRANSFER_FOG(Out, worldPosition.xyz);
}
