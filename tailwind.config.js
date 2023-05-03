/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '#app',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      theme: '#003264',
      primary: '#303133',
      regular: '#606266',
      secondary: '#909399',

      border: '#DCDFE6',
      fill: '#F0F2F5',

      white: '#FFFFFF',
      black: '#000000',

      success: '#67C23A',
      warning: '#E6A23C',
      danger: '#F56C6C',
      info: '#909399',
      normal: '#409EFF'
    }
  },
  plugins: []
}
