<template>
    <div class="export-actions">
        <UButton
            icon="tabler:copy"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="isCopying"
            :disabled="isExportDisabled"
            :class="ghostButtonHoverClasses"
            @click="handleCopy"
        >
            Copy
        </UButton>
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
const isCopying = ref(false)
const activeFormat = ref<TExportFormat | null>(null)
const isExportDisabled = computed(() => isDownloading.value || isCopying.value || isLoading.value)

const toast = useToast()

const handleCopy = async () => {
    if (isExportDisabled.value) return

    try {
        isCopying.value = true

        const htmlContent = snapshot.value.html ?? '<p></p>'
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        const plainText = doc.body.textContent ?? ''

        const isSecureContext = window.isSecureContext
        const hasClipboard = !!navigator.clipboard

        if (!hasClipboard) {
            const errorMsg = isSecureContext
                ? 'Clipboard API not available in this browser'
                : 'Clipboard requires HTTPS or localhost. Current URL: ' + window.location.origin

            throw new Error(errorMsg)
        }

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' }),
                }),
            ])
        }
        catch {
            await navigator.clipboard.writeText(plainText)
        }

        toast.add({
            title: 'Copied to clipboard',
            description: 'Ready to paste into a text editor',
            color: 'success',
            duration: 1500,
        })
    }
    catch (error) {
        console.error('Failed to copy to clipboard:', error)
        toast.add({
            title: 'Copy failed',
            description: error instanceof Error ? error.message : 'Could not copy to clipboard',
            color: 'error',
        })
    }
    finally {
        isCopying.value = false
    }
}

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
