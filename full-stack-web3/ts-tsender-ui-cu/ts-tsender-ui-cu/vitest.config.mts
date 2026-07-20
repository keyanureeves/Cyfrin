import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom', //simulation a browser env
        exclude: ['**/node_modules/**', '**/test/**', 'playwright-report/**', 'test-results/**'], //run any test from these folders
        deps: {
            inline: ['wagmi', '@wagmi/core'] //inline dependencies to avoid issues with vitest and wagmi
        }
    },

})