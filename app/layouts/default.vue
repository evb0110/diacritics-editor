<script setup lang="ts">
</script>

<template>
    <div
        class="app-shell-bg h-screen flex text-workspace-text"
        style="overflow-x: visible;"
    >
        <main
            class="main-container flex flex-col flex-1 h-full w-full mx-auto py-1 lg:py-4 px-4 lg:px-4 overflow-y-auto"
            style="overflow-x: visible;"
        >
            <div
                class="flex items-center justify-between pb-2 flex-shrink-0 gap-8"
                style="overflow: visible;"
            >
                <h1 class="text-xl lg:text-2xl font-bold text-workspace-text">
                    Diacritics Editor
                </h1>
                <div class="flex items-center gap-8">
                    <ExportActions />
                    <ThemeToggle />
                </div>
            </div>
            <slot />
        </main>
    </div>
</template>

<style scoped>
.main-container {
    max-width: 1536px;
}

@media (min-width: 1920px) {
    .main-container {
        max-width: 1800px;
    }
}
</style>
