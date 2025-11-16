<template>
    <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        :icon="icon"
        :aria-label="tooltip"
        square
        :class="ghostButtonHoverClasses"
        :ui="buttonUi"
        @click="toggleTheme"
    />
</template>

<script setup lang="ts">
import { ghostButtonHoverClasses } from '~/utils/ghostButtonUi'

const colorMode = useColorMode()
const colorModeCookie = useCookie('color-mode')

const currentTheme = computed(() => {
    if (import.meta.server && colorModeCookie.value) {
        return colorModeCookie.value
    }
    return colorMode.value
})

const icon = computed(() => {
    return currentTheme.value === 'dark' ? 'lucide:sun' : 'lucide:moon'
})

const tooltip = computed(() => {
    return currentTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
})

const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const buttonUi = {
    base: 'rounded-full transition-colors',
}
</script>
