import { useState } from "react";
import { cn } from "../../lib/utils";

const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "x", name: "X (Twitter)" },
  { id: "instagram", name: "Instagram" },
  { id: "tiktok", name: "TikTok" },
  { id: "newsletter", name: "Newsletter" },
];

export function PlatformSelector({ selected = [], onChange = () => {} }) {
  const togglePlatform = (id) => {
    onChange((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="mb-8">
      <label className="text-sm font-medium text-white block mb-3">
        Target Platforms
      </label>
      <div className="flex flex-wrap gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-sm border transition-all duration-200",
                isSelected
                  ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  : "bg-[#111111] text-[#A0A0A0] border-[#2A2A2A] hover:bg-[#1A1A1A] hover:border-[#3A3A3A] hover:text-white"
              )}
            >
              {platform.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
