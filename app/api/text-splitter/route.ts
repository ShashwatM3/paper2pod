import { NextRequest, NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const total_text = body.file_content;
    
    // Validate input
    if (!total_text || typeof total_text !== 'string') {
      return NextResponse.json(
        { error: "Invalid file_content: expected a non-empty string", texts: null }, 
        { status: 400 }
      );
    }
    
    console.log("Received text length:", total_text.length);
    
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1700, chunkOverlap: 20 })
    // splitText is async in LangChain v1
    const texts = await splitter.splitText(total_text);
    
    console.log("Split into", texts.length, "chunks");
    console.log("First chunk:", texts[0]?.substring(0, 50));

    return NextResponse.json({ texts: texts, error: null });
  } catch(error: any) {
  
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to check: " + error.message, texts: null }, 
      { status: 500 }
    );
    
  }
}