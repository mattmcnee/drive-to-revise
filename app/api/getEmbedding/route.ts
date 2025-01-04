import axios from "axios";

export async function POST(req: Request) {
  try {
    // Step 1: Parse the request body using await req.json()
    const { 
      inputText  
    } = await req.json();

    // Step 2: Fetch and confirm API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "API key is missing" }), {
        status: 500,
      });
    }

    // Step 3: Make a POST request to OpenAI embeddings endpoint
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: inputText,
        model: "text-embedding-3-small"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        }
      }
    );

    // Step 4: Send the embedding back to the client
    const embedding = response.data.data[0].embedding;
    
    return new Response(JSON.stringify({ embedding }), {
      status: 200,
    });
        
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}