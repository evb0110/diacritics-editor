<template>
    <WorkspaceCard>
        <template #header>
            <div class="download-panel__header">
                <div class="flex items-center gap-4">
                    <UIcon name="lucide:download" />
                    <span class="download-panel__title font-semibold text-workspace-text">
                        Export
                    </span>
                </div>
                <span class="download-panel__hint">Choose a format</span>
            </div>
        </template>
        <div class="download-panel__body">
            <div class="download-panel__button-row hidden sm:flex">
                <UButton
                    v-for="option in formatOptions"
                    :key="option.key"
                    :icon="option.icon"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :loading="activeFormat === option.key && isDownloading"
                    :disabled="isDisabled"
                    :class="['download-panel__button', ghostButtonHoverClasses]"
                    @click="handleDownload(option.key)"
                >
                    {{ option.label }}
                </UButton>
            </div>
        </div>
    </WorkspaceCard>
</template>

<script setup lang="ts">
import type { TExportFormat } from '~/utils/downloadArticle'
import { downloadArticle } from '~/utils/downloadArticle'
import { ghostButtonHoverClasses } from '~/utils/ghostButtonUi'

interface IFormatOption {
    key: TExportFormat
    label: string
    icon: string
}

const formatOptions: IFormatOption[] = [
    { key: 'docx', label: 'DOCX', icon: 'lucide:file-down' },
    { key: 'pdf', label: 'PDF', icon: 'lucide:file-text' },
    { key: 'json', label: 'JSON', icon: 'lucide:braces' },
    { key: 'html', label: 'HTML', icon: 'lucide:code' },
]

const { content } = useArticleStorage()

const snapshot = computed(() => ({
    json: content.value?.json ?? {},
    html: content.value?.html ?? '<p></p>',
}))

const isDownloading = ref(false)
const activeFormat = ref<TExportFormat | null>(null)

const isDisabled = computed(() => isDownloading.value)

const handleDownload = async (format: TExportFormat) => {
    if (isDisabled.value) return
    try {
        isDownloading.value = true
        activeFormat.value = format
        await downloadArticle({
            format,
            snapshot: snapshot.value,
            filename: 'article',
        })
    }
    catch (error) {
        console.error('Failed to download file:', error)
    }
    finally {
        isDownloading.value = false
        activeFormat.value = null
    }
}
</script>

<style scoped>
.download-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--workspace-card-header-padding-y) var(--workspace-card-header-padding-x);
    min-height: var(--workspace-card-header-min-height);
}

.download-panel__title {
    line-height: 1.5;
}

.download-panel__body {
    padding: var(--panel-padding);
    display: flex;
    flex-direction: column;
    gap: var(--panel-gap);
}

.download-panel__hint {
    font-size: var(--panel-font-size);
    color: var(--workspace-muted-text);
}
.download-panel__button-row {
    flex-wrap: wrap;
    gap: var(--panel-button-gap);
}

.download-panel__button {
    min-width: var(--panel-button-min-width);
}
</style>
