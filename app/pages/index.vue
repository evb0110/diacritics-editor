<template>
    <div
        class="
            grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]
            flex-1 min-h-0 w-full mx-auto
            pt-1 pb-3 lg:pt-3 lg:pb-3
        "
    >
        <TipTapEditor class="workspace-editor w-full lg:h-full" />

        <div class="flex flex-col gap-4 min-h-0 lg:h-full">
            <div class="flex-shrink-0">
                <DownloadPanel />
            </div>
            <div
                v-for="display in codeDisplays"
                :key="display.language"
                class="flex-1 workspace-code-panel"
            >
                <CodeDisplay v-bind="display" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface ICodeDisplay {
    icon: string
    title: string
    code: Record<string, unknown> | string
    language: 'json' | 'html'
}

const contentJson = useArticleContent('json')
const contentHtml = useArticleContent('html')

const codeDisplays = computed<ICodeDisplay[]>(() => [
    {
        icon: 'tabler:braces',
        title: 'JSON',
        code: contentJson.value,
        language: 'json',
    },
    {
        icon: 'tabler:code',
        title: 'HTML',
        code: contentHtml.value,
        language: 'html',
    },
])
</script>

<style scoped>
.workspace-editor {
    min-height: var(--editor-pane-height);
}

.workspace-code-panel {
    min-height: var(--code-display-min-height);
}
</style>
