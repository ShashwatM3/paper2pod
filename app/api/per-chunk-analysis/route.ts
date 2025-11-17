import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texts = body.texts;

    // Validate input
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: "Invalid texts: expected a non-empty array of strings", summaries: null }, 
        { status: 400 }
      );
    }

    const prompt = `
You are an expert research communicator with mastery across scientific, technical, and scholarly domains. 
Summarize the following passage in 3-4 sentences, ensuring you capture:

- The key concepts or theoretical ideas being introduced
- Any important methods, formulas, models, arguments, or analytical approaches
- Critical data, claims, or findings
- The role this passage plays in the overall structure or argument of the paper

Maintain precision and preserve nuanced details. 
Make the summary clear and engaging, but do not simplify away essential complexity.
    `
    
    // Process all chunks in parallel
    const chunks_summaries = await Promise.all(
      texts.map((text: string) =>
        generateText({
          model: openai('gpt-4o-mini'),
          prompt: prompt + `

Input Text Chunk:
${text}
        `,
        }).then(({ text: chunk_summary }) => chunk_summary)
      )
    );

    return NextResponse.json({ summaries: chunks_summaries, error: null });
  } catch(error: any) {

    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to analyze chunks: " + error.message, summaries: null }, 
      { status: 500 }
    );
    
  }
}