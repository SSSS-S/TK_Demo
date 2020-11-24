#include <common.inc>

struct FVertexOutput
{
    float4 Position : SV_Position;
    float2 TexCoord : TEXCOORD0;
};

cbuffer PostprocessBloomThreshold {
	float _Threshold;
	float _SoftThreshold;
}

float4 Main(in FVertexOutput In) : SV_Target0
{
    float3 c = SAMPLE_TEXTURE(sourceTex, In.TexCoord).xyz;
    half brightness = max(c.r, max(c.g, c.b));
	half knee = _Threshold * _SoftThreshold;
	half soft = brightness - _Threshold + knee;
	soft = clamp(soft, 0, 2 * knee);
	soft = soft * soft / (4 * knee + 0.00001);
	half contribution = max(soft, brightness - _Threshold);
	contribution /= max(brightness, 0.00001);
	return float4(c * contribution, 1);
}
