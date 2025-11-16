import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [{
                    group: ['.*', '../*'],
                    message: 'Use absolute imports with ~/ instead',
                }],
            }],
            '@typescript-eslint/no-extraneous-class': ['error', {
                allowStaticOnly: true,
            }],
            'vue/no-v-html': 'off',
        },
    },
    {
        files: ['eslint.config.mjs'],
        rules: {
            'no-restricted-imports': 'off',
        },
    },
)
