import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";

export function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
      <h1 className="text-3xl font-bold text-white tracking-tight mb-8">Settings</h1>
      
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-sm mb-8">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-white mb-1">Profile</h2>
          <p className="text-[#A0A0A0] text-sm">Manage your personal information</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Name</label>
            <input
              type="text"
              disabled
              value={user?.name || ""}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-[#666666] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Email</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-3 py-2 text-[#666666] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-sm mb-8">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-white mb-1">Preferences</h2>
          <p className="text-[#A0A0A0] text-sm">Manage your app experience</p>
        </div>
        
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-white font-medium">Dark Mode</div>
            <div className="text-[#A0A0A0] text-sm">Dark theme is enforced globally</div>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0A0A0A] border border-[#3A3A3A]">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-red-900/30 rounded-sm">
        <div className="p-6 border-b border-red-900/30">
          <h2 className="text-xl font-semibold text-white mb-1">Danger Zone</h2>
        </div>
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={logout}
            className="text-red-500 border-red-900/50 hover:bg-red-900/20 hover:text-red-400"
          >
            Sign out of {user?.email}
          </Button>
        </div>
      </div>
    </div>
  );
}
