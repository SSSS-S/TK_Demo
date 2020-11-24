#include <common.inc>

struct FVertexInput
{
	float2 Position : a_position;
};

struct FVertexOutput
{
	float4 Position : SV_Position;
	float2 TexCoord : TEXCOORD0;
};

FVertexOutput Main(FVertexInput In)
{
	FVertexOutput Output;
	Output.Position = float4(In.Position, 0, 1);
	Output.TexCoord = In.Position * .5 + .5;
	return Output;
}

