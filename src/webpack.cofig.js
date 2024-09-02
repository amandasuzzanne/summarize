const path = require('path');

module.exports = {
  entry: '.config/gemini.js', // Your entry file
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};
