module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      screens: {
        mobile: { max: '640px' },
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px'
      },
      colors: {
        primary: '#211c1c',
        secondary: '#403535',
        orange: 'orange',
        gray: '#606060',
        text: '#e4bd8d'
      },
      fontFamily: {
        signika: 'Signika'
      },
      backgroundImage: theme => ({
        dashboard: "url('/src/assets/backgrounds/dashboard.jpg')",
        'game-state-waiting': "url('/src/assets/backgrounds/game-state-waiting.jpg')"
      }),
      width: {
        'f-120': '120px'
      },
      minHeight: {
        'f-145': '145px'
      },
      minWidth: {
        'f-120': '120px',
        'f-300': '300px'
      }
    }
  }
}
