import "server-only"; 
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the client. It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
    }

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ Return a ReadableStream so the frontend can consume chunks
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text ?? "";
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
export async function GET() {
  try {
    const prompt  = 'give me 10 country names';

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call the Gemini model (gemini-3.5-flash is ideal for general text/multimodal tasks)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    // console.log(response)
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}