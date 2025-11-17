export interface IToolbarButtonConfig {
    type: 'button'
    id: string
    icon?: string
    text?: string
    isBold?: boolean
}

export type TToolbarItemConfig = IToolbarButtonConfig

export const toolbarConfig: TToolbarItemConfig[][] = [
    [
        { type: 'button', id: 'bold', icon: 'tabler:bold', isBold: true },
        { type: 'button', id: 'italic', icon: 'tabler:italic' },
        { type: 'button', id: 'underline', icon: 'tabler:underline' },
        { type: 'button', id: 'strikethrough', icon: 'tabler:strikethrough' },
        { type: 'button', id: 'smallCaps', text: 'ᴋ' },
    ],
    [
        { type: 'button', id: 'undo', icon: 'tabler:arrow-back-up' },
        { type: 'button', id: 'redo', icon: 'tabler:arrow-forward-up' },
    ],
    [
        { type: 'button', id: 'glottalStop', text: 'Ɂ' },
        { type: 'button', id: 'pharyngealFricative', text: 'ʕ' },
        { type: 'button', id: 'sharpS', text: 'ß' },
        { type: 'button', id: 'ae', text: 'æ' },
        { type: 'button', id: 'schwa', text: 'ə' },
        { type: 'button', id: 'undertie', text: '‿' },
        { type: 'button', id: 'squareRoot', text: '√' },
    ],
    [
        { type: 'button', id: 'graveAccent', text: 'à' },
        { type: 'button', id: 'acuteAccent', text: 'á' },
        { type: 'button', id: 'circumflexAccent', text: 'â' },
        { type: 'button', id: 'tildeAccent', text: 'ã' },
        { type: 'button', id: 'diaeresisAccent', text: 'ä' },
        { type: 'button', id: 'macronAccent', text: 'ā' },
        { type: 'button', id: 'breveAccent', text: 'ă' },
        { type: 'button', id: 'invertedBreveAccent', text: 'ȃ' },
        { type: 'button', id: 'dotAboveAccent', text: 'ȧ' },
        { type: 'button', id: 'ringAboveAccent', text: 'å' },
        { type: 'button', id: 'caronAccent', text: 'ǎ' },
        { type: 'button', id: 'dotBelowAccent', text: 'ạ' },
        { type: 'button', id: 'macronBelowAccent', text: 'a̱' },
        { type: 'button', id: 'ringBelowAccent', text: 'ḁ' },
        { type: 'button', id: 'cedillaAccent', text: 'a̧' },
        { type: 'button', id: 'circumflexBelowAccent', text: 'a̭' },
        { type: 'button', id: 'breveBelowAccent', text: 'a̮' },
    ],
]
