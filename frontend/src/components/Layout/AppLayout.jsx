import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Sidebar hidden on mobile, visible on md+ screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation />
        
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
