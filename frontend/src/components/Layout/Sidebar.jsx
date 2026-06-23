import { Link, useLocation } from "react-router-dom";
import { Plus, Clock, Bookmark, Search } from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#2A2A2A] bg-[#0A0A0A] flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <Link 
          to="/project/new" 
          className="flex items-center justify-start w-full h-9 px-4 py-2 text-sm font-medium rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white bg-[#111111] text-[#A0A0A0] border border-[#2A2A2A] hover:bg-[#1A1A1A] hover:border-[#3A3A3A] hover:text-white group"
        >
          <Plus className="mr-2 h-4 w-4 text-[#A0A0A0] group-hover:text-white transition-colors" />
          New Project
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#111111] border border-[#2A2A2A] rounded-sm py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#3A3A3A] transition-colors"
          />
        </div>
      </div>

      <div className="mt-4 px-2">
        <h3 className="px-2 text-xs font-medium text-[#666666] uppercase tracking-wider mb-2">
          Recent Projects
        </h3>
        <div className="space-y-0.5">
          {["Q3 Marketing Campaign", "Product Launch Post", "Weekly Newsletter"].map((project, i) => (
            <Link
              key={i}
              to={`/project/${project.toLowerCase().replace(/ /g, '-')}`}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-sm transition-colors text-left ${
                location.pathname.includes(project.toLowerCase().replace(/ /g, '-'))
                  ? "bg-[#111111] text-white"
                  : "text-[#A0A0A0] hover:bg-[#111111] hover:text-white"
              }`}
            >
              <Clock className="mr-2 h-4 w-4 text-[#666666]" />
              <span className="truncate">{project}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 px-2">
        <h3 className="px-2 text-xs font-medium text-[#666666] uppercase tracking-wider mb-2">
          Saved Outputs
        </h3>
        <div className="space-y-0.5">
          {["Viral Twitter Hooks", "LinkedIn Formats"].map((saved, i) => (
            <button
              key={i}
              className="w-full flex items-center px-2 py-1.5 text-sm text-[#A0A0A0] hover:bg-[#111111] hover:text-white rounded-sm transition-colors text-left"
            >
              <Bookmark className="mr-2 h-4 w-4 text-[#666666]" />
              <span className="truncate">{saved}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
