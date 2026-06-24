import { useState } from "react";
import { Copy, RefreshCw, Download, Loader2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { cn } from "../../lib/utils";

const OUTPUT_TABS = [
  { id: "linkedin", label: "LinkedIn Post" },
  { id: "x", label: "X Thread" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok Script" },
  { id: "newsletter", label: "Newsletter" },
];

const MOCK_OUTPUTS = {
  linkedin: `🚀 Thrilled to announce the launch of our new content repurposing tool!\n\nIf you're a creator, you know the struggle: you spend 10 hours writing a blog post, but only 10 minutes sharing it. That's a massive missed opportunity.\n\nOur platform takes that one blog post and automatically generates:\n✅ Engaging LinkedIn posts\n✅ Viral X threads\n✅ Newsletter structures\n\nStop wasting time rewriting. Start repurposing.\n\n#ContentCreation #SaaS #Marketing`,
  x: `1/ You spend 10 hours on a blog post. \n\nBut only 10 minutes distributing it.\n\nYou're leaving 90% of your audience on the table. Here's how to fix it: 🧵`,
  instagram: `Spent 10 hours writing a blog post, and only 10 minutes sharing it? 🤦‍♂️\n\nThat's a huge waste of potential. Here's how our new platform helps you turn 1 piece of content into 5+ custom assets automatically. Link in bio! 🔗`,
  tiktok: `[Hook] You are wasting 90% of your content's potential.\n[Visual] Pointing to text "10 Hours Writing vs. 10 Mins Sharing".\n[Body] If you spend hours writing a blog, script, or newsletter, and only post it once, you're missing out. Here is the secret workflow top creators use to repurpose one piece of content into everything.`,
  newsletter: `Subject: Stop writing new content. Start repurposing.\n\nHey friends,\n\nI used to spend 20 hours a week creating content from scratch for 5 different platforms. It was exhausting, and honestly, not very effective.\n\nThe game changed when I realized something: your audience on Twitter doesn't read your blog. Your newsletter subscribers don't see your LinkedIn posts.\n\nHere is my framework for 10x distribution...`,
};

export function OutputSection({ content, isLoading, onRegenerate }) {
  const [activeTab, setActiveTab] = useState("linkedin");

  const displayData = content || MOCK_OUTPUTS;
  const activeText = displayData[activeTab] || "";
  const charCount = activeText ? activeText.length : 0;

  const handleCopy = () => {
    if (activeText) {
      navigator.clipboard.writeText(activeText);
      alert("Copied to clipboard!");
    }
  };
  const handleExport = () => {
    if (!activeText) return;
    // create a blob from the txt content
    const blob = new
      Blob([activeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `reprop-${activeTab}-content.txt`; // e.g., reprop-linkedin-content.txt
    document.body.appendChild(a);
    a.click(); // Automatically click it
    //clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12 border-t border-[#2A2A2A] pt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white tracking-tight">Generated Assets</h2>
      </div>

      <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm flex flex-col">
        {/* Tabs Header */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-[#2A2A2A]">
          {OUTPUT_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                  isActive
                    ? "text-white"
                    : "text-[#A0A0A0] hover:text-[#D0D0D0] hover:bg-[#111111]"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <div className="bg-[#111111] rounded-sm border border-[#2A2A2A] p-5 mb-4 min-h-[200px] flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-white opacity-80" />
                <span className="text-sm text-[#A0A0A0]">Repurposing your content...</span>
              </div>
            ) : (
              <p className="text-[#D0D0D0] whitespace-pre-wrap font-sans leading-relaxed text-sm">
                {activeText || `No content generated for ${activeTab} yet.`}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-[#666666]">
              {isLoading ? "0" : charCount} characters
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" disabled={isLoading} onClick={onRegenerate}>
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" className="gap-2" disabled={isLoading || !activeText} onClick={handleExport}>
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 bg-white text-black hover:bg-gray-200 border-none"
                onClick={handleCopy}
                disabled={isLoading || !activeText}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
