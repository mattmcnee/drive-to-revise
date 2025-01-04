import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    // Step 1: Parse the request body using await req.json()
    const { 
      model = "gpt-4o-mini", 
      temperature = 0.3,
      max_tokens = 500,
      messages,  
    } = await req.json();

    // Step 2: Fetch and confirm API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
      });
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Step 3: Call the OpenAI API to get chat completions
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens
    });

    // Step 4: Return the response to the client
    const message = response.choices[0].message.content;
    return new Response(JSON.stringify({ message: message }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
