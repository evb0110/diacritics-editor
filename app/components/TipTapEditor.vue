<template>
    <div class="editor-shell">
        <WorkspaceCard>
            <template #header>
                <div class="editor-header">
                    <EditorToolbar
                        :items="toolbarItems"
                        @button-click="handleButtonClick"
                    />
                </div>
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
    </div>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { EditorContent } from '@tiptap/vue-3'
import { useTipTapEditor } from '~/composables/useTipTapEditor'
import { useArticleStorage } from '~/composables/useArticleStorage'
import { whenever } from '@vueuse/core'
import { toolbarConfig, type TToolbarItemConfig } from '~/utils/editorToolbarConfig'
import type { IToolbarButton } from '~/components/EditorToolbar.vue'

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

const specialCharMap: Record<string, string> = {
    glottalStop: 'Ɂ',
    pharyngealFricative: 'ʕ',
    sharpS: 'ß',
    ae: 'æ',
    schwa: 'ə',
    undertie: '‿',
    squareRoot: '√',
}

const diacriticMap: Record<string, string> = {
    graveAccent: '\u0300',
    acuteAccent: '\u0301',
    circumflexAccent: '\u0302',
    tildeAccent: '\u0303',
    diaeresisAccent: '\u0308',
    macronAccent: '\u0304',
    breveAccent: '\u0306',
    invertedBreveAccent: '\u0311',
    dotAboveAccent: '\u0307',
    ringAboveAccent: '\u030A',
    caronAccent: '\u030C',
    dotBelowAccent: '\u0323',
    macronBelowAccent: '\u0331',
    ringBelowAccent: '\u0325',
    cedillaAccent: '\u0327',
    circumflexBelowAccent: '\u032D',
    breveBelowAccent: '\u032E',
}

const applyDiacritic = (editor: Editor, combiningChar: string) => {
    const { state } = editor
    const { selection } = state
    const { $from } = selection
    const { doc } = state

    const textBefore = doc.textBetween(Math.max(0, $from.pos - 1), $from.pos)

    if (textBefore.length > 0 && !/\s/.test(textBefore)) {
        const withAccent = textBefore + combiningChar
        const normalized = withAccent.normalize('NFC')

        const from = $from.pos - 1
        const to = $from.pos

        let marks: typeof state.schema.text extends (text: string, marks?: infer M) => unknown ? M : never = null
        doc.nodesBetween(from, to, (node) => {
            if (node.isText && node.marks) {
                marks = node.marks
            }
        })

        editor.chain()
            .focus()
            .deleteRange({ from, to })
            .command(({ tr }) => {
                const node = state.schema.text(normalized, marks)
                tr.insert(tr.selection.from, node)
                return true
            })
            .run()
    }
}

const executeCommand = (buttonId: string, editor: Editor) => {
    if (specialCharMap[buttonId]) {
        editor.chain().focus().insertContent(specialCharMap[buttonId]).run()
        return
    }

    if (diacriticMap[buttonId]) {
        applyDiacritic(editor, diacriticMap[buttonId])
        return
    }

    const commands = {
        bold: () => editor.chain().focus().toggleBold().run(),
        italic: () => editor.chain().focus().toggleItalic().run(),
        underline: () => editor.chain().focus().toggleUnderline().run(),
        strikethrough: () => editor.chain().focus().toggleStrike().run(),
        smallCaps: () => editor.chain().focus().toggleSmallCaps().run(),
        undo: () => editor.chain().focus().undo().run(),
        redo: () => editor.chain().focus().redo().run(),
    }

    commands[buttonId as keyof typeof commands]?.()
}

const checkIsActive = (buttonId: string, editor: Editor): boolean => {
    if (specialCharMap[buttonId] || diacriticMap[buttonId]) {
        return false
    }

    const activeChecks = {
        bold: () => editor.isActive('bold'),
        italic: () => editor.isActive('italic'),
        underline: () => editor.isActive('underline'),
        strikethrough: () => editor.isActive('strike'),
        smallCaps: () => editor.isActive('smallCaps'),
        undo: () => false,
        redo: () => false,
    }

    return activeChecks[buttonId as keyof typeof activeChecks]?.() ?? false
}

const canApplyDiacritic = (editor: Editor): boolean => {
    const { state } = editor
    const { selection } = state
    const { $from } = selection
    const { doc } = state

    if ($from.pos === 0) {
        return false
    }

    const textBefore = doc.textBetween(Math.max(0, $from.pos - 1), $from.pos)

    return textBefore.length > 0 && !/\s/.test(textBefore)
}

const checkCanExecute = (buttonId: string, editor: Editor): boolean => {
    if (specialCharMap[buttonId]) {
        return true
    }

    if (diacriticMap[buttonId]) {
        return canApplyDiacritic(editor)
    }

    const canExecuteChecks = {
        undo: () => editor.can().chain().focus().undo().run(),
        redo: () => editor.can().chain().focus().redo().run(),
    }

    return canExecuteChecks[buttonId as keyof typeof canExecuteChecks]?.() ?? true
}

const transformConfigItem = (config: TToolbarItemConfig): IToolbarButton => {
    return {
        type: 'button',
        id: config.id,
        icon: config.icon,
        text: config.text,
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
    font-family: Helvetica, Arial, sans-serif;
    font-size: 18px;
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

.editor-shell {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.editor-header {
    display: flex;
    align-items: center;
    padding: var(--workspace-card-header-padding-y) var(--workspace-card-header-padding-x);
    min-height: var(--workspace-card-header-min-height);
    padding-top: 0.5rem;
}
</style>
