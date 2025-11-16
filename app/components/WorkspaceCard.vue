<template>
    <div class="workspace-card">
        <div class="workspace-card__section">
            <slot name="header" />
        </div>
        <div class="workspace-card__body">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.workspace-card {
    background-color: var(--workspace-bg);
    border: var(--border-width) solid var(--workspace-border);
    border-radius: var(--workspace-card-radius);
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    overflow: hidden;
}

.workspace-card__section {
    background-color: var(--workspace-muted);
    border-bottom: var(--border-width) solid var(--workspace-border);
}

.workspace-card__body {
    background-color: var(--workspace-bg);
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>
