<template>
    <div
        class="flex flex-col flex-1 min-h-0 w-full mx-auto pt-1 pb-3 lg:pt-3 lg:pb-3"
        style="overflow: visible;"
    >
        <TipTapEditor class="flex flex-col flex-1 min-h-0 w-full" />
    </div>
</template>

<script setup lang="ts">
useSeoMeta({
    title: 'Diacritics Editor - Online Text Editor for Diacritical Marks',
    description: 'A powerful online text editor for adding and managing diacritical marks. Support for multiple languages with export to DOCX and PDF formats.',
    ogTitle: 'Diacritics Editor - Online Text Editor for Diacritical Marks',
    ogDescription: 'A powerful online text editor for adding and managing diacritical marks. Support for multiple languages with export to DOCX and PDF formats.',
    ogImage: '/og-image.png',
    ogImageAlt: 'Diacritics Editor Interface',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Diacritics Editor - Online Text Editor for Diacritical Marks',
    twitterDescription: 'A powerful online text editor for adding and managing diacritical marks. Support for multiple languages with export to DOCX and PDF formats.',
    twitterImage: '/og-image.png',
})

useSchemaOrg([
    {
        '@type': 'WebApplication',
        'name': 'Diacritics Editor',
        'description': 'A powerful online text editor for adding and managing diacritical marks',
        'applicationCategory': 'UtilitiesApplication',
        'operatingSystem': 'Any',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
        },
    },
])
</script>

<style scoped>
</style>
