<template>
    <WorkspaceCard>
        <template #header>
            <div class="code-display__header">
                <div class="flex items-center gap-2">
                    <UIcon :name="icon" />
                    <h3 class="font-semibold text-workspace-text">
                        {{ title }}
                    </h3>
                </div>
                <div class="flex items-center gap-4">
                    <UButton
                        v-for="button in buttons"
                        :key="button.key"
                        :icon="button.icon"
                        color="neutral"
                        variant="ghost"
                        :class="ghostButtonHoverClasses"
                        :title="button.title"
                        @click="handleButtonClick(button.key)"
                    />
                </div>
            </div>
        </template>
        <div class="code-display__body">
            <div
                v-if="isLoading"
                class="p-4"
            >
                <SkeletonList :total-height="120" />
            </div>
            <div
                v-else
                class="code-container"
            >
                <pre
                    ref="highlightEl"
                    :class="['code-block', 'code-block--highlight', `code-block--${language}`]"
                    aria-hidden="true"
                    v-html="highlightedCode"
                />
                <textarea
                    ref="textareaEl"
                    :value="formattedCode"
                    :class="['code-block', 'code-block--textarea', `code-block--${language}`]"
                    aria-live="polite"
                    readonly
                    spellcheck="false"
                    @scroll="handleScroll"
                />
            </div>
        </div>
    </WorkspaceCard>
</template>

<script setup lang="ts">
import { highlightJson, highlightHtml } from '~/utils/highlight'
import { useArticleStorage } from '~/composables/useArticleStorage'
import beautify from 'js-beautify'
import { ghostButtonHoverClasses } from '~/utils/ghostButtonUi'

const beautifyHtml = beautify.html

const { isLoading } = useArticleStorage()

interface IProps {
    icon: string
    title: string
    code: Record<string, unknown> | string
    language: 'json' | 'html'
}

const { icon, title, code, language } = defineProps<IProps>()

const isFormatted = ref(true)
const isCopying = ref(false)

const highlightEl = ref<HTMLPreElement>()
const textareaEl = ref<HTMLTextAreaElement>()

const handleScroll = () => {
    if (highlightEl.value && textareaEl.value) {
        highlightEl.value.scrollTop = textareaEl.value.scrollTop
        highlightEl.value.scrollLeft = textareaEl.value.scrollLeft
    }
}

const formattedCode = computed<string>(() => {
    if (language === 'json') {
        const jsonData = code
        return isFormatted.value
            ? JSON.stringify(jsonData, null, 2)
            : JSON.stringify(jsonData)
    }

    if (language === 'html') {
        const htmlString = typeof code === 'string' ? code : String(code)
        return isFormatted.value
            ? beautifyHtml(htmlString, {
                    indent_size: 2,
                    wrap_line_length: 40,
                    preserve_newlines: true,
                    max_preserve_newlines: 2,
                    wrap_attributes: 'force-aligned',
                    end_with_newline: false,
                    inline: [],
                })
            : htmlString
    }

    return String(code)
})

const highlightedCode = computed(() => {
    const codeValue = formattedCode.value
    return language === 'json'
        ? highlightJson(codeValue)
        : highlightHtml(codeValue)
})

const buttons = computed(() => [
    {
        key: 'copy',
        icon: isCopying.value ? 'tabler:check' : 'tabler:copy',
        title: `Copy ${title}`,
    },
    {
        key: 'format',
        icon: isFormatted.value ? 'tabler:arrows-minimize' : 'tabler:arrows-maximize',
        title: isFormatted.value ? 'Minify' : 'Format',
    },
])

const handleButtonClick = (key: string) => {
    switch (key) {
        case 'copy':
            handleCopy()
            break
        case 'format':
            isFormatted.value = !isFormatted.value
            break
    }
}

const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(formattedCode.value)
        isCopying.value = true
        setTimeout(() => {
            isCopying.value = false
        }, 2000)
    }
    catch (error) {
        console.error('Failed to copy:', error)
    }
}
</script>

<style scoped>
.code-display__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--workspace-card-header-padding-y) var(--workspace-card-header-padding-x);
    min-height: var(--workspace-card-header-min-height);
    color: var(--workspace-text);
}

.code-display__body {
    flex: 1;
    min-height: 0;
    overflow: auto;
    background-color: var(--workspace-bg);
}

@media (min-width: 1024px) {
    .code-display__body {
        max-height: var(--code-display-max-height);
    }
}

.code-display__body::-webkit-scrollbar {
    width: var(--scrollbar-size);
    height: var(--scrollbar-size);
}

.code-display__body::-webkit-scrollbar-track {
    background-color: transparent;
}

.code-display__body::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.3);
    border-radius: var(--scrollbar-thumb-radius);
}

.code-container {
    display: grid;
    width: 100%;
    height: 100%;
}

.code-block {
    grid-area: 1 / 1;
    margin: 0;
    background-color: var(--code-block-bg);
    color: var(--code-block-text);
    padding: 0.5rem 0.75rem;
    font-size: var(--font-size-code);
    line-height: var(--code-line-height);
    font-family: 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    letter-spacing: var(--code-letter-spacing);
    white-space: pre-wrap;
    word-break: break-word;
    overflow: auto;
}

.code-block--highlight {
    pointer-events: none;
    overflow: hidden;
}

.code-block--textarea {
    border: none;
    outline: none;
    resize: none;
    background-color: transparent;
    color: transparent;
    caret-color: var(--code-block-text);
}

.code-block :deep(.token) {
    font-weight: 500;
}

.code-block :deep(.token.key) {
    color: var(--code-token-key);
    font-weight: 600;
}

.code-block :deep(.token.string) {
    color: var(--code-token-string);
    font-weight: 600;
}

.code-block :deep(.token.number) {
    color: var(--code-token-number);
}

.code-block :deep(.token.boolean) {
    color: var(--code-token-boolean);
}

.code-block :deep(.token.null) {
    color: var(--code-token-null);
}

.code-block :deep(.token.punctuation) {
    color: var(--code-token-punctuation);
}

.code-block :deep(.token.tag) {
    color: var(--code-token-tag);
    font-weight: 600;
}

.code-block :deep(.token.attr-name) {
    color: var(--code-token-attr-name);
}

.code-block :deep(.token.attr-value) {
    color: var(--code-token-attr-value);
}
</style>
