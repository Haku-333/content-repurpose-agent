import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { ContentInput } from "../components/Dashboard/ContentInput";
import { PlatformSelector } from "../components/Dashboard/PlatformSelector";
import { OutputSection } from "../components/Dashboard/OutputSection";
import { Button } from "../components/ui/Button";
import { generateContent } from "../services/api";
import { Link } from "react-router-dom";

export function Project() {
  const { id } = useParams();

  const isNew = id === "new";

  // 1. Lifted States:
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState(["linkedin", "x"]);

  //2. States for API loading status and resulting data
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  //3. The Function that calls the backend 
  const handleGenerate = async () => {
    if (!content.trim() || platforms.length === 0) return;

    setIsLoading(true);
    try {
      // NOTE: Your backend currently accepts a single platform string. 
      // For now, we are passing the first selected platform from the array or a comma-separated string.
      const targetPlatform = platforms.join(", ");

      const result = await generateContent(content, targetPlatform);
      // Update the output section state with our successful response
      setGeneratedOutput(result);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {isNew ? "Create New Project" : `Project: ${id}`}
        </h1>
      </div>

      <div className="bg-[#0A0A0A] rounded-sm">
        {/* Pass the state to the inputs */}
        <ContentInput content={content} onChange={setContent} />
        <PlatformSelector selected={platforms} onChange={setPlatforms} />

        <div className="pt-4 flex justify-start">
          {/* Connect our click handler to the Button */}
          <Button
            size="lg"
            className="gap-2 bg-white text-black hover:bg-gray-200 shadow-sm font-semibold disabled:opacity-50"
            onClick={handleGenerate}
            disabled={isLoading || !content.trim() || platforms.length === 0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </div>
      {/* Show the output section only when we actually have generated data or when loading */}
      {(generatedOutput || isLoading || !isNew) && (
        <div className="mt-8">
          <OutputSection content={generatedOutput} isLoading={isLoading} onRegenerate={handleGenerate} />
        </div>
      )}
    </div>
  );
}
