import { accentPalette, brandPalette, dangerPalette, warningPalette } from '~/design-system/tokens'

export default defineAppConfig({
    ui: {
        colors: {
            primary: 'rio',
            neutral: 'slate',
            rio: brandPalette[600],
            mint: accentPalette[400],
            warning: warningPalette[400],
            danger: dangerPalette[400],
        },
    },
})
