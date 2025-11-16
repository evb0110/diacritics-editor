import { designSystemCss } from '~/design-system/tokens'

export default defineNuxtPlugin(() => {
    useHead({
        style: [
            {
                key: 'rior-design-system',
                innerHTML: designSystemCss,
            },
        ],
    })
})
