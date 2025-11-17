<template>
    <div class="export-actions">
        <UButton
            v-for="option in formatOptions"
            :key="option.key"
            :icon="option.icon"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="activeFormat === option.key && isDownloading"
            :disabled="isExportDisabled"
            :class="ghostButtonHoverClasses"
            @click="handleDownload(option.key)"
        >
            {{ option.label }}
        </UButton>
    </div>
</template>

<script setup lang="ts">
import type { TExportFormat } from '~/utils/downloadArticle'
import { downloadArticle } from '~/utils/downloadArticle'
import { ghostButtonHoverClasses } from '~/utils/ghostButtonUi'
import { useArticleStorage } from '~/composables/useArticleStorage'

interface IFormatOption {
    key: TExportFormat
    label: string
    icon: string
}

const formatOptions: IFormatOption[] = [
    { key: 'docx', label: 'DOCX', icon: 'tabler:file-download' },
    { key: 'pdf', label: 'PDF', icon: 'tabler:file-text' },
]

const { content, isLoading } = useArticleStorage()

const snapshot = computed(() => ({
    html: content.value?.html ?? '<p></p>',
}))

const isDownloading = ref(false)
const activeFormat = ref<TExportFormat | null>(null)
const isExportDisabled = computed(() => isDownloading.value || isLoading.value)

const handleDownload = async (format: TExportFormat) => {
    if (isExportDisabled.value) return
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
.export-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
