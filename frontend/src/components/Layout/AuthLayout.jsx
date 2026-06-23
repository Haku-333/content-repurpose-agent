import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-white flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold text-sm">r</span>
            </div>
            <span className="font-semibold text-white tracking-tight text-xl">reprop.io</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
