<script setup lang="ts">
</script>

<template>
    <div class="app-shell-bg h-screen flex text-workspace-text">
        <main class="flex flex-col flex-1 h-full max-w-screen-2xl w-full mx-auto py-1 lg:py-4 px-4 lg:px-4 overflow-hidden">
            <div class="flex items-center justify-between pb-2 flex-shrink-0">
                <h1 class="text-3xl lg:text-4xl font-bold text-workspace-text">
                    Diacritics Editor
                </h1>
                <div class="flex items-center gap-16">
                    <ExportActions />
                    <ThemeToggle />
                </div>
            </div>
            <slot />
        </main>
    </div>
</template>
