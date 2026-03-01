"use client";

import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const THEME_PRESETS = [
  { name: "Fox Orange", hue: 50, chroma: 0.18 },
  { name: "Forest Green", hue: 145, chroma: 0.14 },
  { name: "Ocean Blue", hue: 240, chroma: 0.16 },
  { name: "Berry Red", hue: 25, chroma: 0.2 },
  { name: "Sunset Pink", hue: 350, chroma: 0.15 },
  { name: "Golden", hue: 85, chroma: 0.16 },
];

export function ColorPicker() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("Fox Orange");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyTheme(preset: (typeof THEME_PRESETS)[number]) {
    const root = document.documentElement;
    const h = preset.hue;
    const c = preset.chroma;

    root.style.setProperty("--primary", `oklch(0.65 ${c} ${h})`);
    root.style.setProperty("--ring", `oklch(0.65 ${c} ${h})`);
    root.style.setProperty("--accent", `oklch(0.75 ${c * 0.83} ${h + 15})`);
    root.style.setProperty("--secondary", `oklch(0.95 ${c * 0.11} ${h + 20})`);
    root.style.setProperty("--muted", `oklch(0.94 ${c * 0.06} ${h + 20})`);
    root.style.setProperty("--border", `oklch(0.9 ${c * 0.11} ${h + 15})`);
    root.style.setProperty("--input", `oklch(0.92 ${c * 0.08} ${h + 15})`);
    root.style.setProperty("--background", `oklch(0.98 ${c * 0.03} ${h + 20})`);

    setActiveTheme(preset.name);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-medium text-card-foreground shadow-sm ring-1 ring-border transition-all hover:shadow-md"
        aria-label="Change theme color"
      >
        <Palette className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl bg-card p-3 shadow-lg ring-1 ring-border">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pick a color
          </p>
          <div className="grid grid-cols-3 gap-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyTheme(preset)}
                className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted"
                aria-label={`Apply ${preset.name} theme`}
              >
                <span
                  className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all group-hover:scale-110"
                  style={{
                    backgroundColor: `oklch(0.65 ${preset.chroma} ${preset.hue})`,
                    ringColor:
                      activeTheme === preset.name
                        ? `oklch(0.65 ${preset.chroma} ${preset.hue})`
                        : "transparent",
                  }}
                />
                <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
