/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#09090b',        // Obsidian black
        bg2: '#18181b',       // Gunmetal dark surface (Cards)
        bg3: '#27272a',       // Elevated surface (Inputs)
        bg4: '#3f3f46',       // Highlights/Hover
        border: 'rgba(255, 255, 255, 0.08)',
        border2: 'rgba(255, 255, 255, 0.15)',
        text: '#fafafa',      // Ultra-white
        text2: '#a1a1aa',     // Zinc secondary
        text3: 'rgba(161, 161, 170, 0.5)',
        cyan: '#06b6d4',      // Crisp cyan
        'cyan-dim': 'rgba(6, 182, 212, 0.15)',
        green: '#10b981',     // Emerald status
        'green-dim': 'rgba(16, 185, 129, 0.12)',
        red: '#ef4444',       // Rose-red status
        'red-dim': 'rgba(239, 68, 68, 0.12)',
        amber: '#f59e0b',     // Gold status
        'amber-dim': 'rgba(245, 158, 11, 0.12)',
        blue: '#3b82f6',      // Royal blue
        'blue-dim': 'rgba(59, 130, 246, 0.15)',
      },
      fontFamily: {
        head: ['Outfit', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
