export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxt/ui',
        '@pinia/nuxt',
        '@vite-pwa/nuxt',
        'nuxt-icon',
    ],
    icon: {
        collections: ['heroicons', 'mdi']
    },
    css: ['~/assets/css/main.css'],
    pwa: {
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
                {
                    urlPattern: '^https://.*',
                    handler: 'NetworkFirst',
                    options: { cacheName: 'offline-cache' }
                }
            ]
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 3600
        },

        manifest: {
            name: 'AdBrowser',
            short_name: 'Ads',
            theme_color: '#3B82F6',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait-primary',
            icons: [
                { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        }
    },
    typescript: {
        strict: true
    }
})