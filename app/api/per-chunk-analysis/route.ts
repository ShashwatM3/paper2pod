import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texts = body.texts;
    const complexity = body.complexity;

    // Validate input
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: "Invalid texts: expected a non-empty array of strings", summaries: null }, 
        { status: 400 }
      );
    }

    const prompt = `
You are an expert research communicator who can translate scholarly text for audiences of varying expertise.
Your task is to produce a 3–4 sentence podcast-style summary of the provided passage.

Adapt your writing to the specified complexity level, which will be one of:

"Beginner" — The listener has no technical background in this domain.

Use plain language

Define important ideas intuitively

Avoid heavy notation or jargon

Preserve meaning, but not technical detail

"Intermediate" — The listener has some familiarity with scientific/analytic thinking but may not know domain-specific terminology.

Use moderate technical language

Briefly mention methods, equations, models without deep formalism

Preserve key concepts and logic

"Advanced" — The listener wants a summary with depth comparable to reading the original paper.

Use domain-appropriate terminology

Preserve methods, formulas, models, and analytic reasoning

Highlight why the passage matters to the paper’s overall argument

Your summary must always capture:

The core concepts or theoretical ideas being introduced

Any important methods, equations, models, or analytic approaches

Key claims, data, or findings

How this passage fits into the structure or intent of the paper

Output Requirements

Produce exactly 3–4 sentences

Maintain clarity, flow, and accuracy

No loss of essential nuance—only adjust explanatory sophistication based on the complexity level

User Prompt Template

Summarize the passage below according to the guidelines above.
Complexity level: ${complexity}
    `
    
    // Process all chunks in parallel
    const chunks_summaries = await Promise.all(
      texts.map((text: string) =>
        generateText({
          model: openai('gpt-4o-mini'),
          prompt: prompt + `

Passage:
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