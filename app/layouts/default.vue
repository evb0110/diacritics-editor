<script setup lang="ts">
</script>

<template>
    <div class="app-shell-bg min-h-screen lg:h-screen flex text-workspace-text">
        <main class="flex flex-col flex-1 h-full max-w-7xl w-full mx-auto py-1 lg:py-4 px-4 lg:px-4 overflow-hidden">
            <div class="flex items-center justify-between pb-2">
                <h1 class="text-3xl lg:text-4xl font-bold text-workspace-text">
                    Текст публикации
                </h1>
                <ThemeToggle />
            </div>
            <slot />
        </main>
    </div>
</template>
