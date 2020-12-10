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
        gray: '#606060'
      },
      fontFamily: {
        signika: 'Signika'
      },
      backgroundImage: theme => ({
        dashboard: "url('/src/components/pages/Dashboard/assets/background.jpg')"
      })
    }
  }
}