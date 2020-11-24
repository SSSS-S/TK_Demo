#include <common.inc>


cbuffer Material
{
	float4 _TintColor;
    float _Exposure;
    float _Rotation;
}

DECLARE_CUBEMAP(u_MainTex);

struct FVertexOutput
{
	float4 Position : SV_Position;
    float3 pos: TEXCOORD0;
};

float4 Main(in FVertexOutput In) : SV_Target0
{
	return SAMPLE_CUBEMAP(u_MainTex, In.pos) * float4(_TintColor.xyz, 1.0) * _Exposure * 2.0;
}