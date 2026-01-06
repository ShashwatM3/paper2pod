# Paper2Podcast 🎙️

Transform research papers into engaging, podcast-style audio narratives. Upload a PDF and get an AI-generated podcast that explains the paper's concepts, methodology, and findings in a natural, conversational format.

## Features

- **PDF Upload & Processing**: Extract text from research papers automatically
- **Adaptive Complexity Levels**: Choose between Beginner, Intermediate, or Advanced explanations
- **Smart Text Analysis**: Breaks down papers into digestible chunks and analyzes each section
- **Natural Podcast Generation**: Creates flowing, conversational narratives (not bullet points!)
- **High-Quality Audio**: Converts transcripts to audio using ElevenLabs TTS
- **Download & Play**: Listen in-browser or download for offline use

## How It Works

1. **Upload**: Select a PDF research paper
2. **Choose Complexity**: Pick your preferred depth level (Beginner/Intermediate/Advanced)
3. **Processing Pipeline**:
   - Extracts text from PDF
   - Splits into ~1700 character chunks
   - Analyzes each chunk with context-aware summaries
   - Synthesizes into a cohesive podcast transcript
   - Converts to high-quality audio
4. **Listen**: Play directly or download the generated podcast

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **AI Models**: 
  - OpenAI GPT-4o (transcript generation)
  - OpenAI GPT-4o-mini (chunk analysis)
- **Text-to-Speech**: ElevenLabs API
- **Text Processing**: LangChain text splitters
- **PDF Parsing**: react-pdftotext
- **UI**: React 19, Tailwind CSS 4, shadcn/ui components
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API key
- ElevenLabs API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shashwatm3-paper2pod

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

### `/api/text-splitter`
Splits PDF content into manageable chunks using LangChain's RecursiveCharacterTextSplitter.

### `/api/per-chunk-analysis`
Analyzes each text chunk and generates complexity-appropriate summaries.

### `/api/create-podcast-transcript`
Synthesizes all chunk summaries into a flowing, natural podcast narrative.

### `/api/text-to-speech`
Converts the transcript to audio using ElevenLabs TTS API.

## Project Structure

```
app/
├── api/                    # API routes for processing
│   ├── text-splitter/
│   ├── per-chunk-analysis/
│   ├── create-podcast-transcript/
│   └── text-to-speech/
├── HomePage.js             # Main UI component
├── layout.tsx
└── page.tsx
components/
└── ui/                     # shadcn/ui components
lib/
└── utils.ts
```

## Complexity Levels

- **Beginner**: Plain language, intuitive definitions, minimal jargon
- **Intermediate**: Moderate technical language, mentions methods without deep formalism
- **Advanced**: Full technical depth comparable to reading the original paper

## Limitations

- PDF must be text-based (not scanned images)
- Processing time varies with paper length (typically 2-5 minutes)
- Audio generation requires ElevenLabs API quota

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- AI powered by [OpenAI](https://openai.com) and [ElevenLabs](https://elevenlabs.io)
- Text processing with [LangChain](https://www.langchain.com)

---

**Note**: This project requires valid API keys for OpenAI and ElevenLabs to function. Make sure to set up your environment variables before running.
