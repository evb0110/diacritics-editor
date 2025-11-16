export const editorButtonUi = {
    base: 'transition-colors text-[var(--editor-toolbar-button-fg)]',
    color: {
        primary: {
            soft: 'bg-[var(--editor-toolbar-button-active-bg)] text-[var(--editor-toolbar-button-active-fg)] hover:bg-[var(--editor-toolbar-button-active-hover-bg)]',
        },
        neutral: {
            ghost: 'text-[var(--editor-toolbar-button-fg)] hover:bg-[var(--editor-toolbar-button-hover-bg)]',
        },
    },
} as const

export const editorButtonActiveClasses = [
    '!bg-[var(--editor-toolbar-button-active-bg)]',
    '!text-[var(--editor-toolbar-button-active-fg)]',
    'hover:!bg-[var(--editor-toolbar-button-active-hover-bg)]',
    'disabled:hover:!bg-transparent',
    'aria-disabled:hover:!bg-transparent',
].join(' ')

export const editorButtonInactiveClasses = [
    '!text-[var(--editor-toolbar-button-fg)]',
    'hover:!bg-[var(--editor-toolbar-button-hover-bg)]',
    'disabled:hover:!bg-transparent',
    'aria-disabled:hover:!bg-transparent',
].join(' ')

export function getEditorButtonClasses(isActive: boolean): string {
    return isActive ? editorButtonActiveClasses : editorButtonInactiveClasses
}
