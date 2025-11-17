import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const summaries = body.summaries;

    // Validate input
    if (!summaries || !Array.isArray(summaries) || summaries.length === 0) {
      return NextResponse.json(
        { error: "Invalid summaries: expected a non-empty array of strings", transcript: null }, 
        { status: 400 }
      );
    }

    const prompt = `
Transform the following summary into a podcast-style narrative that feels natural, flowing, and genuinely human. 
Write it as if a knowledgeable expert is speaking to an enthusiastic listener—conversational, confident, and easy to follow, without sounding scripted or segmented.

Requirements:
- Preserve all meaningful technical details, concepts, methods, equations, data, and results
- Explain ideas smoothly using natural transitions, helpful analogies, and intuitive explanations
- Maintain a narrative arc that organically covers:
    • the problem or question the paper addresses
    • why this problem matters
    • how the authors approached it (step-by-step, but not explicitly numbered)
    • what experiments or analyses were done
    • what was discovered (results, data, insights)
    • what limitations or uncertainties remain
    • what future directions or implications emerge

Guidelines:
- Do NOT use list structures, numbered points, headers, or explicit section labels
- Avoid phrases like “first,” “second,” “in conclusion,” “this section argues,” etc.
- Make the flow feel like continuous storytelling rather than a report
- Tone should be smooth, engaging, and conversational—like a well-produced research explainer podcast
- Aim for 8–15 minutes of spoken content depending on the depth, maintaining clarity without shortening essential details
    `


    const { text: podcast_transcript } = await generateText({
      model: openai('gpt-4o'),
      prompt: prompt + `

Chunk-based summaries of the paper:
${JSON.stringify(summaries)}
      `
    });

    return NextResponse.json({ transcript: podcast_transcript, error: null });
  } catch(error: any) {
  
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to create podcast transcript: " + error.message, transcript: null }, 
      { status: 500 }
    );
    
  }
}