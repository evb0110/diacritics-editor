export interface IToolbarButtonConfig {
    type: 'button'
    id: string
    icon: string
    isBold?: boolean
}

export interface IToolbarLinkPopoverConfig {
    type: 'link-popover'
}

export type TToolbarItemConfig = IToolbarButtonConfig | IToolbarLinkPopoverConfig

export const toolbarConfig: TToolbarItemConfig[][] = [
    [
        { type: 'button', id: 'bold', icon: 'lucide:bold', isBold: true },
        { type: 'button', id: 'italic', icon: 'lucide:italic' },
        { type: 'button', id: 'underline', icon: 'lucide:underline' },
        { type: 'button', id: 'strikethrough', icon: 'tabler:strikethrough' },
    ],
    [
        { type: 'link-popover' },
    ],
    [
        { type: 'button', id: 'heading1', icon: 'lucide:heading-1' },
        { type: 'button', id: 'heading2', icon: 'lucide:heading-2' },
    ],
    [
        { type: 'button', id: 'bulletList', icon: 'lucide:list' },
        { type: 'button', id: 'orderedList', icon: 'lucide:list-ordered' },
        { type: 'button', id: 'blockquote', icon: 'tabler:blockquote' },
    ],
    [
        { type: 'button', id: 'codeBlock', icon: 'lucide:code' },
    ],
    [
        { type: 'button', id: 'undo', icon: 'lucide:undo' },
        { type: 'button', id: 'redo', icon: 'lucide:redo' },
    ],
]
