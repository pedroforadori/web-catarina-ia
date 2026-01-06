/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                meta: {
                    dark: '#020617', // Slate 950
                    panel: '#0f172a', // Slate 900
                    accent: '#4338ca', // Indigo 700
                    highlight: '#6366f1', // Indigo 500
                    text: '#f8fafc', // Slate 50
                    subtext: '#94a3b8', // Slate 400
                }
            }
        }
    }
}