<template>
    <div class="flex-1 min-h-0 w-full mx-auto pt-1 pb-3 lg:pt-3 lg:pb-3">
        <TipTapEditor class="workspace-editor w-full h-full" />
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.workspace-editor {
    min-height: var(--editor-pane-height);
}

.workspace-code-panel {
    min-height: var(--code-display-min-height);
}
</style>
