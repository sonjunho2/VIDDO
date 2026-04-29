import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { idea, style, length } = await req.json();

    const prompt = `Create a ${length} ${style} video script based on this idea:\n${idea}\n\nMake it engaging and structured.`;

    const response = await client.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    return Response.json({
      script: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
