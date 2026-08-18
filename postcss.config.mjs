// String form: Turbopack resolves the plugin itself. Importing the plugin here
// instead pulls lightningcss's native binding into the bundle and breaks the build.
export default {
  plugins: ['@tailwindcss/postcss'],
}
