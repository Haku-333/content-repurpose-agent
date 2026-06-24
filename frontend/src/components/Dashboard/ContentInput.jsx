import { useRef } from "react";
import { Upload } from "lucide-react";

export function ContentInput({ content = "", onChange = () => {} }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read the file as text
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Append or replace the content. For this workflow, replacing is standard, 
      // but we can append if there's already text. Let's just replace for now.
      onChange(text);
    };
    reader.onerror = () => {
      alert("Error reading file. Please make sure it is a text-based file (.txt, .md, .csv).");
    };
    reader.readAsText(file);
    
    // Reset the input value so the user can re-upload the same file if needed
    e.target.value = "";
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-2">
        <label htmlFor="content-input" className="text-sm font-medium text-white block">
          Source Content
        </label>
        <span className="text-xs text-[#666666] font-mono">
          {content?.length || 0} / 5000
        </span>
      </div>

      <div className="relative group">
        <textarea
          id="content-input"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your blog post, YouTube script, or ideas here..."
          className="w-full h-48 bg-[#111111] border border-[#2A2A2A] rounded-sm p-4 text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3A3A3A] focus:ring-1 focus:ring-[#3A3A3A] transition-colors resize-none"
        />

        {/* Hidden file input */}
        <input 
          type="file" 
          accept=".txt,.md,.csv,.json"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="absolute bottom-4 right-4 flex items-center">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-sm bg-[#1A1A1A] text-[#A0A0A0] border border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
