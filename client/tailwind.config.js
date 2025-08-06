/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'elaia': {
          'cream': '#FFF8F3',      // Crème clair pour les backgrounds
          'charcoal': '#1A1A1A',   // Noir charbon pour le texte principal
          'warm-gray': '#4A4A4A',  // Gris chaud pour le texte secondaire
          'light-gray': '#F5F5F5', // Gris très clair pour les sections
          'sand': '#C9B7A4',       // Sable/beige pour les accents
          'sage': '#7C8471',       // Vert sauge pour les boutons secondaires
          'white': '#FFFFFF',      // Blanc pur
          'muted': '#E8E8E8',      // Gris muté pour les bordures
        },
        'ohemia': {
          'primary': '#2C2C2C',    // Couleur principale sombre
          'accent': '#B5985A',     // Doré subtil pour les accents
          'neutral': '#F7F6F3',    // Neutre clair
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'lora': ['Lora', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      }
    },
  },
  plugins: [],
}

