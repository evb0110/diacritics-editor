export interface IToolbarButtonConfig {
    type: 'button'
    id: string
    icon: string
    isBold?: boolean
}

export type TToolbarItemConfig = IToolbarButtonConfig

export const toolbarConfig: TToolbarItemConfig[][] = [
    [
        { type: 'button', id: 'bold', icon: 'tabler:bold', isBold: true },
        { type: 'button', id: 'italic', icon: 'tabler:italic' },
        { type: 'button', id: 'underline', icon: 'tabler:underline' },
        { type: 'button', id: 'strikethrough', icon: 'tabler:strikethrough' },
    ],
    [
        { type: 'button', id: 'undo', icon: 'tabler:arrow-back-up' },
        { type: 'button', id: 'redo', icon: 'tabler:arrow-forward-up' },
    ],
]
