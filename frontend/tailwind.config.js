/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Deep Navy Light Palette ──────────────────────────────────
        bg:      '#F1F6F9',        // Ice White — page bg
        bg2:     '#FFFFFF',        // White — elevated surfaces
        bg3:     '#E2E8ED',        // Soft blue-grey mix — cards, panels, inputs
        bg4:     '#9BA4B4',        // Silver blue 
        border:  'rgba(155, 164, 180, 0.30)',
        border2: 'rgba(57, 72, 103, 0.30)',
        // ── Text ──────────────────────────────────────────────────────
        text:    '#0A1326',        // Very Dark Navy (Near Black)
        text2:   '#14274E',        // Deep Navy
        text3:   '#394867',        // Slate
        // ── Primary Accent — Deep Navy (#14274E) ──────────────────────────
        cyan:    '#14274E',
        'cyan-dim': 'rgba(20, 39, 78, 0.10)',
        // ── Secondary Accent — Slate (#394867) ───────────────────────
        blue:    '#394867',
        'blue-dim': 'rgba(57, 72, 103, 0.15)',
        // ── Status Colors (cool-toned) ─────────────────────────────────
        green:   '#3D8C6E',        // Cool sage green
        'green-dim': 'rgba(61, 140, 110, 0.15)',
        red:     '#B04A4A',        // Muted rose-red
        'red-dim': 'rgba(176, 74, 74, 0.15)',
        amber:   '#A07830',        // Dusty amber
        'amber-dim': 'rgba(160, 120, 48, 0.15)',
      },
      fontFamily: {
        head: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(154, 166, 178, 0.25)' },
          '100%': { boxShadow: '0 0 22px rgba(154, 166, 178, 0.55)' },
        }
      }
    },
  },
  plugins: [],
}
