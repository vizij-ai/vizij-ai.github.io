/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		// This config exists primarily to help IDEs recognize Tailwind v4's at-rules.
		// Tailwind v4 uses Vite plugin for processing, not PostCSS.
		// We don't include tailwindcss here because v4 handles it differently.

		// Only include autoprefixer for browser compatibility
		autoprefixer: {},
	},
};

export default config;
