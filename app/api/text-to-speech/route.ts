import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transcript = body.transcript;
    const voiceId = body.voiceId || 'JBFqnCBsd6RMkjVDRZzb';

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Invalid transcript" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const client = new ElevenLabsClient({
      apiKey,
      environment: "https://api.elevenlabs.io",
    });

    // 1️⃣ Call ElevenLabs (returns ReadableStream)
    const audioStream = await client.textToSpeech.convert(voiceId, {
      outputFormat: "mp3_44100_128",
      text: transcript,
      modelId: "eleven_multilingual_v2",
    });

    // 2️⃣ Convert ReadableStream → Buffer using getReader()
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
      }
    }

    // Combine all chunks into a single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // 3️⃣ Return binary MP3 response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error: any) {
    console.error("Error converting text:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}