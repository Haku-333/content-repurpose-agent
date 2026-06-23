import { HeroSection } from "../components/Dashboard/HeroSection";
import { ContentInput } from "../components/Dashboard/ContentInput";
import { PlatformSelector } from "../components/Dashboard/PlatformSelector";
import { Button } from "../components/ui/Button";
import { Sparkles } from "lucide-react";

export function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
      <HeroSection />

      <div className="bg-[#0A0A0A] rounded-sm">
        <ContentInput />
        <PlatformSelector />

        <div className="pt-4 flex justify-start">
          <Button size="lg" className="gap-2 bg-white text-black hover:bg-gray-200 shadow-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Go to Project
          </Button>
        </div>
      </div>
    </div>
  );
}