
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Check, 
  PaintBucket, 
  Layout, 
  Database 
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [tab, setTab] = useState<"appearance" | "sidebar" | "data">("appearance");
  const [sidebarStyle, setSidebarStyle] = useState("gradient");
  const [sidebarColor, setSidebarColor] = useState("#3B365E");
  const [accentColor, setAccentColor] = useState("#1cd7b6");
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    // Save sidebar settings (this would typically update a context or storage)
    toast.success("Settings saved successfully");
  };

  // Color options for app theme
  const colorOptions = [
    { name: "Teal", value: "#1cd7b6" },
    { name: "Blue", value: "#4EC6E0" },
    { name: "Orange", value: "#F49C3F" },
    { name: "Pink", value: "#EF476F" },
    { name: "Purple", value: "#3B365E" },
  ];

  // Sidebar themes
  const sidebarThemes = [
    { name: "Gradient Purple", value: "gradient", preview: "bg-gradient-to-b from-indigo-900 to-purple-900" },
    { name: "Solid Dark", value: "dark", preview: "bg-[#1A1F2C]" },
    { name: "Navy Blue", value: "navy", preview: "bg-[#1e2a4a]" },
    { name: "Deep Teal", value: "teal", preview: "bg-[#0d3a3a]" },
    { name: "Custom Color", value: "custom", preview: `bg-[${sidebarColor}]` },
  ];

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-4xl font-bold text-white mb-1">Settings</h1>
      <div className="text-lg text-gray-300 mb-8">Configure application settings and preferences</div>
      <div className="flex flex-row gap-2 bg-[#101112] rounded-2xl p-1 w-fit mb-10">
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "appearance" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("appearance")}>
          <PaintBucket className="inline-block mr-2 h-4 w-4" /> Appearance
        </button>
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "sidebar" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("sidebar")}>
          <Layout className="inline-block mr-2 h-4 w-4" /> Sidebar
        </button>
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "data" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("data")}>
          <Database className="inline-block mr-2 h-4 w-4" /> Data Management
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {tab === "appearance" && (
          <>
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Theme Settings</h2>
              <div className="mb-2 text-gray-400">Customize the application's visual theme</div>
              {/* Theme mode radios */}
              <div className="flex flex-col gap-3 mb-8">
                <label className="flex items-center gap-3 cursor-pointer text-lg text-white font-semibold">
                  <input type="radio" name="theme" defaultChecked className="accent-[#1cd7b6]" />
                  Light
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-lg text-white font-semibold">
                  <input type="radio" name="theme" className="accent-[#1cd7b6]" />
                  Dark
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-lg text-white font-semibold">
                  <input type="radio" name="theme" className="accent-[#1cd7b6]" />
                  System
                </label>
              </div>
              {/* Accent colors */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Accent Color</h3>
                <div className="grid grid-cols-5 gap-4">
                  {colorOptions.map(color => (
                    <button 
                      key={color.value}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${accentColor === color.value ? 'border-white' : 'border-gray-700/20'}`} 
                      style={{background: color.value}}
                      onClick={() => setAccentColor(color.value)}
                    >
                      {accentColor === color.value && <Check className="text-white h-5 w-5" />}
                    </button>
                  ))}
                </div>
              </div>
              {/* Table style */}
              <div>
                <label className="block mb-1 font-medium text-white">Table Style</label>
                <select className="w-full py-2 px-3 rounded-lg border-black/20 bg-[#333] text-white">
                  <option value="default">Default</option>
                  <option value="bordered">Bordered</option>
                  <option value="striped">Striped</option>
                </select>
              </div>
              <Button 
                className="mt-6 bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold"
                onClick={handleSaveSettings}
              >
                Save Appearance Settings
              </Button>
            </Card>
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Theme Preview</h2>
              <div className="bg-[#262930] rounded-xl py-6 px-6 mb-5 shadow text-gray-300 text-lg">
                This is how text will appear with your selected theme.
              </div>
              <div className="mb-4">
                <div className="rounded-lg bg-[#1cd7b6] px-4 py-2 font-medium text-black mb-2 w-fit">Table Header</div>
                <div className="text-gray-300 pl-2 py-1 border-b border-gray-700">Row 1</div>
                <div className="text-gray-300 pl-2 py-1 border-b border-gray-700">Row 2</div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="bg-[#1cd7b6] text-black font-bold px-4 py-2 rounded-xl">Primary Button</Button>
                <Button className="bg-black text-white font-bold px-4 py-2 rounded-xl shadow-inner border border-gray-800">Secondary</Button>
              </div>
            </Card>
          </>
        )}

        {tab === "sidebar" && (
          <>
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Sidebar Settings</h2>
              <div className="mb-4 text-gray-400">Choose your sidebar style and color preferences.</div>
              
              <label className="block mb-2 text-white font-medium">Sidebar Style</label>
              <select 
                className="w-full py-2 px-3 rounded-lg border-black/20 bg-[#333] text-white font-medium mb-6"
                value={sidebarStyle}
                onChange={(e) => setSidebarStyle(e.target.value)}
              >
                <option value="gradient">Gradient Purple (Default)</option>
                <option value="dark">Solid Dark</option>
                <option value="navy">Navy Blue</option>
                <option value="teal">Deep Teal</option>
                <option value="custom">Custom Color</option>
              </select>
              
              {sidebarStyle === "custom" && (
                <div className="mb-6">
                  <label className="block mb-2 text-white font-medium">Custom Sidebar Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      className="w-16 h-8 rounded focus:outline-[#1cd7b6] bg-transparent" 
                      value={sidebarColor}
                      onChange={(e) => setSidebarColor(e.target.value)}
                    />
                    <span className="text-white">{sidebarColor}</span>
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block mb-2 text-white font-medium">Item Style</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input type="radio" name="itemStyle" defaultChecked className="accent-[#1cd7b6]" />
                    Rounded
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input type="radio" name="itemStyle" className="accent-[#1cd7b6]" />
                    Square
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 text-white font-medium">Icon Position</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input type="radio" name="iconPosition" defaultChecked className="accent-[#1cd7b6]" />
                    Left
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input type="radio" name="iconPosition" className="accent-[#1cd7b6]" />
                    Top
                  </label>
                </div>
              </div>
              
              <Button 
                className="mt-4 bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold"
                onClick={handleSaveSettings}
              >
                Save Sidebar Settings
              </Button>
            </Card>
            
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Sidebar Preview</h2>
              <div className="mb-4 text-gray-400">See how your sidebar will look with these settings.</div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {sidebarThemes.map(theme => (
                  <div 
                    key={theme.value}
                    className={`h-24 rounded-lg ${theme.preview} p-3 flex flex-col cursor-pointer ${sidebarStyle === theme.value ? 'ring-2 ring-[#1cd7b6]' : ''}`}
                    onClick={() => setSidebarStyle(theme.value)}
                  >
                    <span className="text-white text-sm mb-1">{theme.name}</span>
                    <div className="bg-white/10 mt-1 rounded w-3/4 h-2"></div>
                    <div className="bg-white/10 mt-1 rounded w-1/2 h-2"></div>
                    <div className="bg-white/10 mt-1 rounded w-2/3 h-2"></div>
                    {sidebarStyle === theme.value && (
                      <div className="absolute right-2 top-2">
                        <Check className="text-[#1cd7b6] h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className={`${
                  sidebarStyle === 'gradient' ? 'bg-gradient-to-b from-indigo-900 to-purple-900' :
                  sidebarStyle === 'dark' ? 'bg-[#1A1F2C]' :
                  sidebarStyle === 'navy' ? 'bg-[#1e2a4a]' :
                  sidebarStyle === 'teal' ? 'bg-[#0d3a3a]' :
                  `bg-[${sidebarColor}]`
                } p-4 h-80`}>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Milk Center</h3>
                  </div>
                  
                  <div className="text-xs uppercase tracking-wider text-gray-400 ml-2 mb-1">Dashboard</div>
                  <div className="bg-white/10 rounded-lg p-2 mb-2 text-white flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                    <span>Overview</span>
                  </div>
                  
                  <div className="text-xs uppercase tracking-wider text-gray-400 ml-2 mb-1 mt-3">Orders</div>
                  <div className="hover:bg-white/10 rounded-lg p-2 mb-1 text-gray-300 flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                    <span>Order Entry</span>
                  </div>
                  <div className="hover:bg-white/10 rounded-lg p-2 text-gray-300 flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                    <span>Track Sheet</span>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
        
        {tab === "data" && (
          <Card className="w-full md:w-2/3 bg-white/5 rounded-2xl border-0 shadow p-6">
            <h2 className="text-2xl font-bold mb-3 text-white">Data Management</h2>
            <div className="mb-6 text-gray-400">Manage and export your business data</div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#262930] rounded-xl p-5">
                <h3 className="text-xl font-semibold text-white mb-2">Backup Data</h3>
                <p className="text-gray-400 mb-4">Create a complete backup of all your business data</p>
                <Button className="bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold">
                  Export Backup
                </Button>
              </div>
              
              <div className="bg-[#262930] rounded-xl p-5">
                <h3 className="text-xl font-semibold text-white mb-2">Import Data</h3>
                <p className="text-gray-400 mb-4">Import data from a CSV or Excel file</p>
                <Button className="bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold">
                  Import Data
                </Button>
              </div>
              
              <div className="bg-[#262930] rounded-xl p-5">
                <h3 className="text-xl font-semibold text-white mb-2">Export Reports</h3>
                <p className="text-gray-400 mb-4">Download financial and inventory reports</p>
                <Button className="bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold">
                  Generate Reports
                </Button>
              </div>
              
              <div className="bg-[#262930] rounded-xl p-5">
                <h3 className="text-xl font-semibold text-white mb-2">Clear Cache</h3>
                <p className="text-gray-400 mb-4">Reset application cache and temporary data</p>
                <Button className="bg-[#1cd7b6] hover:bg-[#19c2a4] text-black font-bold">
                  Clear Cache
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
