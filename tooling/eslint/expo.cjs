module.exports = {
  extends: ['./react.cjs'],
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react-native'],
  rules: {
    'react-native/no-inline-styles': 'off',
  },
};
