'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Mic2, Mic2Icon } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

function HomePage() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState("");
  const [downtime, setDowntime] = useState(false);

  async function extractText(file) {
    const { default: pdfToText } = await import('react-pdftotext');
    try {
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error("Failed to extract text from pdf", error);
      return null;
    }
  }

  async function testWithSampleTranscript() {
    const sampleTranscript = `
Welcome to today's episode, where we're diving into the intricate world of intelligent language agents. Imagine a system that not only understands tasks but learns and adapts in real-time—today we're talking about CLIN, a novel agent changing the landscape of artificial intelligence and machine learning.

So, what's the big question here? Well, it's about creating an agent that doesn't just memorize tasks but evolves over time, learning from each interaction on its own. Think of a student who improves day by day, not just through practice but by genuinely understanding their experiences. This ability to continually learn and adapt rapidly is crucial for interacting with complex environments—all without the heavy costs and limitations of traditional reinforcement learning.

Now, why does this matter? Picture working on a science simulation game, like ScienceWorld, where the environment is dynamic, and tasks are complex and varied. Existing methods require cumbersome training processes and extensive fine-tuning to adapt to new tasks. That's not feasible if we're aiming for truly intelligent systems that can operate in the kinds of diverse and unpredictable realities we live in.

Here's where CLIN steps in with a refreshing approach. Unlike traditional models that rely on static parameters, CLIN uses a persistent and dynamic memory system. It's like having a flexible notebook that updates with every trial, capturing insights without changing the core model itself. This design allows agents to perform complex tasks with minimal prior training—think of it as a student learning different subjects on the fly by applying past exam papers intelligently.

The methodology here is fascinating. CLIN employs a frozen language model coupled with a memory system to store causal abstractions—essentially keeping a record of what works and what doesn't across various trials. It enhances its zero-shot performance, meaning it gets better at solving tasks it hasn't explicitly been trained on. For instance, in the ScienceWorld benchmarks, CLIN outperformed others by adapting based on previous experiences, even managing a 23-point edge over existing systems.

But how does this memory system work? Imagine "reading" your past experiences each time you face a new problem. CLIN leverages dynamic textual memory, which means it evolves by reflecting on what was previously written in its mental notebook. These reflections capture causal relationships—like understanding why a particular sequence of actions led to a successful outcome—allowing it to generalize this understanding to future tasks.

Now, let's delve into the experiments that back these claims. CLIN was tested across multiple environments, gathering insights from various scenarios—from fetching seeds to making complex scientific discoveries. The agent's ability to adapt was put to the test in new and unseen environments, pushing it to use its accrued knowledge effectively.

The results are remarkable. CLIN consistently improves its performance through memory updates and exhibits significant transfer learning capabilities. This means it not only performs well on tasks it has encountered but also applies this learning to entirely new scenarios—a crucial step toward creating truly autonomous systems.

However, no system is without its flaws. CLIN's learning is somewhat constrained by its exploration capabilities. Imagine knowing you need to find an art studio to complete a task, but not knowing where it is—without exploring, the agent might fail to complete the task because it relies heavily on past experiences.

Looking ahead, there's immense potential here. Enhancing exploratory mechanisms could further optimize task adaptability, making agents like CLIN even more robust. We can envision future models where agents seamlessly navigate real-world complexities, learning continually.

So, the implications for AI development are profound. This work on CLIN shows us a path toward creating more efficient, adaptive learning agents, setting a benchmark for future research. From interactive games to real-world applications, these advancements hint at an exciting future where machines learn as fluidly as humans do.

That's all for today's episode. Join us next time as we explore more on the frontiers of technology and innovation. Keep questioning, keep learning. Until then, stay curious!
    `;

    try {
      setIsGeneratingAudio(true);
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      
      toast.info("Converting sample transcript to audio...");
      
      const audioRes = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: sampleTranscript,
        }),
      });

      if (audioRes.ok) {
        const audioBlob = await audioRes.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        toast.success("Audio generated! Playing now...");
      } else {
        const errorData = await audioRes.json();
        toast.error("Error generating audio: " + (errorData?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error generating audio:", err);
      toast.error("Failed to generate audio: " + err.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  }

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    
    toast.info("Extracting text....")
    const extractedText = await extractText(file);
    console.log("Extracted text length:", extractedText?.length);
    console.log("Extracted text preview:", extractedText?.substring(0, 100));
    
    if (extractedText) {
      try {
        toast.info("Understanding para-by-para text....")
        const splitterRes = await fetch("/api/text-splitter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_content: extractedText,
          }),
        });
      
        const splitterData = await splitterRes.json();
        console.log("Full API response:", splitterData);
        console.log("Response status:", splitterRes.status);
        
        if (!splitterData.error) {
          console.log("Texts array length:", splitterData.texts?.length);
          console.log("Texts:", splitterData.texts);
          toast.info("Understanding the paper thoroughly....")

          try {
            const analysisRes = await fetch("/api/per-chunk-analysis", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                texts: splitterData.texts,
                complexity: complexityLevel
              }),
            });
          
            const analysisData = await analysisRes.json();
            if (analysisData && !analysisData.error) {
              console.log(analysisData.summaries);
              toast.info("Now generating podcast transcript....")

              try {
                const transcriptRes = await fetch("/api/create-podcast-transcript", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    summaries: analysisData.summaries,
                  }),
                });
              
                const transcriptData = await transcriptRes.json();
                if (transcriptData && !transcriptData.error) {
                  toast.success("Podcast transcript generated successfully!")
                  console.log(transcriptData.transcript);
                  
                  // Generate audio from transcript
                  try {
                    setIsGeneratingAudio(true);
                    toast.info("Converting transcript to audio...");
                    
                    const audioRes = await fetch("/api/text-to-speech", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        transcript: transcriptData.transcript,
                      }),
                    });

                    if (audioRes.ok) {
                      const audioBlob = await audioRes.blob();
                      const url = URL.createObjectURL(audioBlob);
                      setAudioUrl(url);
                      toast.success("Audio generated! Playing now...");
                    } else {
                      const errorData = await audioRes.json();
                      toast.error("Error generating audio: " + (errorData?.error || "Unknown error"));
                    }
                  } catch (err) {
                    console.error("Error generating audio:", err);
                    toast.error("Failed to generate audio: " + err.message);
                  } finally {
                    setIsGeneratingAudio(false);
                  }
                } else {
                  toast.error("Error generating transcript: " + (transcriptData?.error || "Unknown error"));
                }
              } catch (err) {
                console.error("Error sending POST request to create-podcast-transcript:", err);
                toast.error("Failed to create podcast transcript: " + err.message);
              }
            } else {
              toast.error("Something went wrong: " + (analysisData?.error || "Unknown error"))
            }
          } catch (err) {
            console.error("Error sending POST request to per-chunk-analysis:", err);
            toast.error("Failed to analyze chunks: " + err.message);
          }
        } else {
          console.error("API error:", splitterData.error);
          toast.error("Error: " + splitterData.error);
        }
      } catch (err) {
        console.error("Error sending POST request to text-splitter:", err);
        toast.error("Failed to split file content: " + err.message);
      }
    } else {
      toast.error("Error in extracting text!")
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.mp3'; // You can customize the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='flex items-center justify-center min-h-screen w-full flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8'>
      <h1 className='scroll-m-20 text-center text-3xl sm:text-4xl md:text-5xl font-light tracking-tight max-w-4xl px-4'>
        Turn your papers into podcasts
      </h1>
      <h1 className='scroll-m-20 text-center text-lg sm:text-xl md:text-2xl text-neutral-500 mb-4 max-w-2xl px-4'>
        Knowledge the way you want it
      </h1>
      {downtime ? (
        <h1>Servers are down. Working on it and will get it up and running by 18th Nov.</h1>
      ):(
        <>
        <Input
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            // Clean up previous audio URL
            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
              setAudioUrl(null);
            }
          }}
          className='w-full max-w-md sm:max-w-lg mb-4'
          accept='.pdf'
        />
        <div className='flex flex-col sm:flex-row gap-3 w-full max-w-md sm:max-w-lg items-center justify-center'>
          {isGeneratingAudio ? (
            <Button 
              disabled={true}
              className='w-full sm:w-auto min-w-[200px]'
            >
              'Generating...'
            </Button>
          ): file ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={audioUrl}>Convert to <Mic2Icon/></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose your complexity level</DialogTitle>
                  <DialogDescription className="mb-3">
                    How in-depth do you want the podcast to go into, for this paper? (i.e. knowledge complexity level)
                  </DialogDescription>
                  {["BEGINNER", "INTERMEDIATE", "As complex as the paper"].map((complexity, index) => (
                    <Button 
                      onClick={() => setComplexityLevel(complexity)} 
                      variant={complexity == complexityLevel ? "secondary" : ""} 
                      className="w-full" 
                      key={`complexity-${complexity}-${index}`}
                    >
                      {complexity}
                    </Button>
                  ))}
                  <br/>
                  <Button className="bg-blue-600" onClick={handleUpload} disabled={complexityLevel.length==0 || isGeneratingAudio}>Generate Podcast <Mic2/></Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : null}
          {/* <Button 
            onClick={testWithSampleTranscript} 
            disabled={isGeneratingAudio}
            variant="outline"
            className='w-full sm:w-auto min-w-[200px]'
          >
            Hear with Sample Transcript
          </Button> */}
        </div>
        {audioUrl && (
          <div className='mt-4 w-full max-w-md sm:max-w-lg lg:max-w-xl px-4'>
            <audio 
              src={audioUrl} 
              controls 
              autoPlay
              className='w-full'
            >
              Your browser does not support the audio element.
            </audio>
            <br/>
            <Button onClick={handleDownload}>Download Podcast <Download/></Button>
          </div>
        )}
        </>
      )}
    </div>
  )
}

export default HomePage