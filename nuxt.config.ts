// eslint-disable-next-line no-restricted-imports -- nuxt.config is evaluated before path aliases are available
import { themeColor } from './app/design-system/tokens'

export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/ui'],
    pages: true,
    components: [{
        path: '~/components',
        pathPrefix: false,
    }],
    devtools: { enabled: true },
    app: {
        head: {
            title: 'Diacritics Editor',
            meta: [
                {
                    name: 'theme-color',
                    content: themeColor,
                },
            ],
            link: [
                {
                    rel: 'icon',
                    type: 'image/svg+xml',
                    href: '/favicon.svg',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: '/favicon-32.png',
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '192x192',
                    href: '/favicon-192.png',
                },
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico',
                },
            ],
        },
    },
    css: ['~/assets/css/main.css'],
    colorMode: {
        preference: 'system',
        fallback: 'light',
        classSuffix: '',
        storageKey: 'nuxt-color-mode',
    },
    srcDir: 'app',
    devServer: {
        host: '0.0.0.0',
        port: 3001,
    },
    compatibilityDate: '2025-07-15',
    vite: {
        server: {
            strictPort: false,
        },
    },
    eslint: {
        config: {
            stylistic: {
                indent: 4,
                quotes: 'single',
                semi: false,
            },
        },
    },
    icon: {
        serverBundle: { collections: ['heroicons', 'tabler'] },
        clientBundle: {
            scan: true,
            sizeLimitKb: 512,
            icons: [
                'tabler:arrow-back-up',
                'tabler:arrow-forward-up',
                'tabler:arrows-maximize',
                'tabler:arrows-minimize',
                'tabler:bold',
                'tabler:braces',
                'tabler:check',
                'tabler:code',
                'tabler:copy',
                'tabler:download',
                'tabler:file-download',
                'tabler:file-text',
                'tabler:italic',
                'tabler:moon',
                'tabler:strikethrough',
                'tabler:sun',
                'tabler:underline',
            ],
        },
        fallbackToApi: false,
        localApiEndpoint: false,
        mode: 'svg',
        provider: 'iconify',
    },
})
