
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [tab, setTab] = useState<"appearance" | "sidebar" | "data">("appearance");

  return (
    <div className="min-h-screen bg-[#181A20] px-8 py-8 rounded-2xl">
      <h1 className="text-4xl font-bold text-white mb-1">Settings</h1>
      <div className="text-lg text-gray-300 mb-8">Configure application settings and preferences</div>
      <div className="flex flex-row gap-2 bg-[#101112] rounded-2xl p-1 w-fit mb-10">
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "appearance" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("appearance")}>🪞 Appearance</button>
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "sidebar" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("sidebar")}>🧩 Sidebar</button>
        <button className={`px-7 py-2 rounded-xl font-semibold text-base transition-all ${
          tab === "data" ? "bg-[#1cd7b6] text-black" : "text-white"
        }`} onClick={() => setTab("data")}>💾 Data Management</button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {tab === "appearance" && (
          <>
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800/80">Theme Settings</h2>
              <div className="mb-2 text-gray-600/70">Customize the application's visual theme</div>
              {/* Theme mode radios */}
              <div className="flex flex-col gap-3 mb-8">
                <label className="flex items-center gap-3 cursor-pointer text-lg text-black font-semibold">
                  <input type="radio" name="theme" defaultChecked className="accent-[#1cd7b6]" />
                  Light
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-lg text-black font-semibold">
                  <input type="radio" name="theme" className="accent-[#1cd7b6]" />
                  Dark
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-lg text-black font-semibold">
                  <input type="radio" name="theme" className="accent-[#1cd7b6]" />
                  System
                </label>
              </div>
              {/* Accent colors */}
              <div className="mb-8 grid grid-cols-5 gap-4">
                {["#1cd7b6", "#4EC6E0", "#F49C3F", "#EF476F", "#3B365E"].map(c =>
                  <button className="w-10 h-10 rounded-lg border-2 border-black/20 focus:outline-[#1cd7b6]" key={c} style={{background: c}}></button>
                )}
              </div>
              {/* Table style */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Table Style</label>
                <select className="w-full py-2 px-3 rounded-lg border-black/20 text-base">
                  <option value="default">Default</option>
                  <option value="bordered">Bordered</option>
                  <option value="striped">Striped</option>
                </select>
              </div>
            </Card>
            <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800/80">Theme Preview</h2>
              <div className="bg-white rounded-xl py-6 px-6 mb-5 shadow text-gray-700 text-lg">This is how text will appear with your selected theme.</div>
              <div className="mb-4">
                <div className="rounded-lg bg-[#b2eedd] px-4 py-2 font-medium text-black mb-2 w-fit">Table Header</div>
                <div className="text-gray-500">Row 1</div>
                <div className="text-gray-500">Row 2</div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="bg-[#1cd7b6] text-white font-bold px-4 py-2 rounded-xl">Primary Button</Button>
                <Button className="bg-black text-white font-bold px-4 py-2 rounded-xl shadow-inner">Secondary</Button>
              </div>
            </Card>
          </>
        )}

        {tab === "sidebar" && (
          <Card className="w-full md:w-1/2 bg-white/5 rounded-2xl border-0 shadow p-6">
            <h2 className="text-2xl font-bold mb-3 text-gray-800/80">Sidebar Settings</h2>
            <div className="mb-4 text-gray-600/80">Choose your sidebar style and color preferences.</div>
            <label className="block mb-2 text-black font-medium">Sidebar Style</label>
            <select className="w-full py-2 px-3 rounded-lg border-black/20 text-base font-medium">
              <option value="default">Default</option>
              <option value="compact">Compact</option>
              <option value="expanded">Expanded</option>
              <option value="gradient">Gradient</option>
            </select>
            <label className="block mt-4 mb-2 text-black font-medium">Sidebar Color</label>
            <input type="color" className="w-16 h-8 rounded focus:outline-[#1cd7b6]" defaultValue="#181A20" />
          </Card>
        )}
        {tab === "data" && (
          <Card className="w-full md:w-2/3 bg-white/5 rounded-2xl border-0 shadow p-6">
            <h2 className="text-2xl font-bold mb-3 text-gray-800/80">Data Management</h2>
            <div className="mb-2 text-gray-600/80">Manage and export your business data (feature coming soon!)</div>
            <Button variant="default" className="bg-[#1cd7b6] mt-4 text-black px-6 py-2 font-bold rounded-lg shadow">Export Data</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
