<template>
    <WorkspaceCard>
        <template #header>
            <EditorToolbar
                :items="toolbarItems"
                @button-click="handleButtonClick"
                @set-link="handleSetLink"
                @remove-link="handleRemoveLink"
            />
        </template>
        <div class="editor-wrapper flex flex-1 p-4 lg:p-5 overflow-y-auto">
            <SkeletonList
                v-if="isLoading"
                :total-height="400"
            />
            <div
                v-else-if="editor"
                class="flex-1"
                @click="() => editor?.commands.focus()"
            >
                <EditorContent
                    :editor="editor"
                    class="tiptap"
                />
            </div>
        </div>
    </WorkspaceCard>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { EditorContent } from '@tiptap/vue-3'
import { useTipTapEditor } from '~/composables/useTipTapEditor'
import { useArticleStorage } from '~/composables/useArticleStorage'
import { whenever } from '@vueuse/core'
import { toolbarConfig, type TToolbarItemConfig } from '~/utils/editorToolbarConfig'
import type { IToolbarButton, IToolbarLinkPopover } from '~/components/EditorToolbar.vue'

const { content, isLoading } = useArticleStorage()

const editor = useTipTapEditor()

let isUpdatingFromEditor = false

watch(() => content.value?.json, (newJson) => {
    if (newJson && editor.value && !isUpdatingFromEditor) {
        editor.value
            .chain()
            .command(({ tr }) => {
                tr.setMeta('addToHistory', false)
                return true
            })
            .setContent(newJson)
            .run()
    }
}, { immediate: true })

watch(() => editor.value?.getJSON(), () => {
    if (editor.value) {
        isUpdatingFromEditor = true
        content.value = {
            json: editor.value.getJSON(),
            html: editor.value.getHTML(),
        }
        nextTick(() => {
            isUpdatingFromEditor = false
        })
    }
}, { deep: true })

whenever(() => editor.value?.getJSON(), () => {
    isUpdatingFromEditor = true
    content.value = {
        json: editor.value!.getJSON(),
        html: editor.value!.getHTML(),
    }
    nextTick(() => {
        isUpdatingFromEditor = false
    })
}, { deep: true })

const executeCommand = (buttonId: string, editor: Editor) => {
    const commands = {
        bold: () => editor.chain().focus().toggleBold().run(),
        italic: () => editor.chain().focus().toggleItalic().run(),
        underline: () => editor.chain().focus().toggleUnderline().run(),
        strikethrough: () => editor.chain().focus().toggleStrike().run(),
        heading1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        heading2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        bulletList: () => editor.chain().focus().toggleBulletList().run(),
        orderedList: () => editor.chain().focus().toggleOrderedList().run(),
        blockquote: () => editor.chain().focus().toggleBlockquote().run(),
        codeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
        undo: () => editor.chain().focus().undo().run(),
        redo: () => editor.chain().focus().redo().run(),
    }

    commands[buttonId as keyof typeof commands]?.()
}

const checkIsActive = (buttonId: string, editor: Editor): boolean => {
    const activeChecks = {
        bold: () => editor.isActive('bold'),
        italic: () => editor.isActive('italic'),
        underline: () => editor.isActive('underline'),
        strikethrough: () => editor.isActive('strike'),
        heading1: () => editor.isActive('heading', { level: 1 }),
        heading2: () => editor.isActive('heading', { level: 2 }),
        bulletList: () => editor.isActive('bulletList'),
        orderedList: () => editor.isActive('orderedList'),
        blockquote: () => editor.isActive('blockquote'),
        codeBlock: () => editor.isActive('codeBlock'),
        undo: () => false,
        redo: () => false,
    }

    return activeChecks[buttonId as keyof typeof activeChecks]?.() ?? false
}

const checkCanExecute = (buttonId: string, editor: Editor): boolean => {
    const canExecuteChecks = {
        undo: () => editor.can().chain().focus().undo().run(),
        redo: () => editor.can().chain().focus().redo().run(),
    }

    return canExecuteChecks[buttonId as keyof typeof canExecuteChecks]?.() ?? true
}

const transformConfigItem = (config: TToolbarItemConfig): IToolbarButton | IToolbarLinkPopover => {
    if (config.type === 'link-popover') {
        return {
            type: 'link-popover',
            isActive: editor.value?.isActive('link') ?? false,
            currentUrl: editor.value?.isActive('link')
                ? editor.value.getAttributes('link').href
                : undefined,
            isDisabled: !editor.value,
        }
    }

    return {
        type: 'button',
        id: config.id,
        icon: config.icon,
        isActive: editor.value ? checkIsActive(config.id, editor.value) : false,
        isDisabled: !editor.value || !checkCanExecute(config.id, editor.value),
        isBold: config.isBold,
    }
}

const toolbarItems = computed(() => {
    return toolbarConfig.map(group => group.map(transformConfigItem))
})

const handleButtonClick = (buttonId: string) => {
    if (editor.value) {
        executeCommand(buttonId, editor.value)
    }
}

const handleSetLink = (url: string) => {
    if (editor.value) {
        editor.value.chain().focus().setLink({ href: url }).run()
    }
}

const handleRemoveLink = () => {
    if (editor.value) {
        editor.value.chain().focus().unsetLink().run()
    }
}
</script>

<style scoped>
.editor-wrapper {
    color: var(--workspace-text);
    line-height: var(--editor-body-line-height);
    flex: 1;
    min-height: 0;
    cursor: text;
}

.tiptap {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.tiptap :deep(.ProseMirror) {
    flex: 1;
    outline: none;
    min-height: 100%;
}

.tiptap :deep(h1) {
    font-size: var(--editor-heading-1-size);
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.tiptap :deep(h2) {
    font-size: var(--editor-heading-2-size);
    font-weight: 700;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
}

.tiptap :deep(h3) {
    font-size: var(--editor-heading-3-size);
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.tiptap :deep(p) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.tiptap :deep(ul) {
    list-style-type: disc;
    margin-top: var(--editor-list-margin);
    margin-bottom: var(--editor-list-margin);
    padding-left: var(--editor-list-indent);
}

.tiptap :deep(ol) {
    list-style-type: decimal;
    margin-top: var(--editor-list-margin);
    margin-bottom: var(--editor-list-margin);
    padding-left: var(--editor-list-indent);
}

.tiptap :deep(li) {
    margin-top: var(--editor-list-item-margin);
    margin-bottom: var(--editor-list-item-margin);
    display: list-item;
}

.tiptap :deep(a) {
    color: var(--link-color);
    text-decoration: underline;
}

.tiptap :deep(a:hover) {
    opacity: 0.75;
}

.tiptap :deep(s),
.tiptap :deep(del) {
    text-decoration: line-through;
}

.tiptap :deep(code) {
    background-color: var(--workspace-muted);
    padding: var(--editor-inline-code-padding-y) var(--editor-inline-code-padding-x);
    border-radius: var(--editor-inline-code-radius);
    font-size: 0.875rem;
    font-family: monospace;
}

.tiptap :deep(pre) {
    background-color: var(--workspace-muted);
    color: var(--workspace-text);
    padding: 0.5rem 0.75rem;
    overflow-x: auto;
    margin-top: var(--editor-list-margin);
    margin-bottom: var(--editor-list-margin);
}

.tiptap :deep(pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
}

.tiptap :deep(blockquote) {
    border-left: var(--editor-blockquote-border-width) solid var(--workspace-border-strong);
    padding-left: var(--editor-blockquote-padding-left);
    font-style: italic;
    margin-top: var(--editor-blockquote-spacing);
    margin-bottom: var(--editor-blockquote-spacing);
}

.tiptap :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin-top: var(--editor-list-margin);
    margin-bottom: var(--editor-list-margin);
}

.tiptap :deep(td),
.tiptap :deep(th) {
    border: var(--border-width) solid var(--workspace-border);
    padding: var(--editor-table-cell-padding-y) var(--editor-table-cell-padding-x);
}

.tiptap :deep(th) {
    background-color: var(--workspace-muted);
    font-weight: 700;
}

.tiptap :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--editor-media-radius);
    margin-top: var(--editor-list-margin);
    margin-bottom: var(--editor-list-margin);
}

.tiptap :deep(hr) {
    margin-top: var(--editor-divider-spacing);
    margin-bottom: var(--editor-divider-spacing);
    border-top: var(--border-width) solid var(--workspace-border-strong);
}
</style>
