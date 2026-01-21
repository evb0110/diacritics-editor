export interface IToolbarButtonConfig {
    type: 'button'
    id: string
    icon?: string
    text?: string
    tooltip?: string
    isBold?: boolean
}

export type TToolbarItemConfig = IToolbarButtonConfig

export interface IToolbarConfig {
    mainGroups: TToolbarItemConfig[][]
    diacriticsGroup: TToolbarItemConfig[]
}

export const toolbarConfig: IToolbarConfig = {
    mainGroups: [
        [
            { type: 'button', id: 'bold', icon: 'tabler:bold', tooltip: 'Bold', isBold: true },
            { type: 'button', id: 'italic', icon: 'tabler:italic', tooltip: 'Italic' },
            { type: 'button', id: 'underline', icon: 'tabler:underline', tooltip: 'Underline' },
            { type: 'button', id: 'strikethrough', icon: 'tabler:strikethrough', tooltip: 'Strikethrough' },
            { type: 'button', id: 'smallCaps', text: 'ᴋ', tooltip: 'Small Caps' },
        ],
        [
            { type: 'button', id: 'undo', icon: 'tabler:arrow-back-up', tooltip: 'Undo' },
            { type: 'button', id: 'redo', icon: 'tabler:arrow-forward-up', tooltip: 'Redo' },
        ],
        [
            { type: 'button', id: 'glottalStop', text: 'Ɂ', tooltip: 'Glottal Stop' },
            { type: 'button', id: 'pharyngealFricative', text: 'ʕ', tooltip: 'Pharyngeal Fricative' },
            { type: 'button', id: 'sharpS', text: 'ß', tooltip: 'Sharp S (Eszett)' },
            { type: 'button', id: 'ae', text: 'æ', tooltip: 'AE Ligature' },
            { type: 'button', id: 'schwa', text: 'ə', tooltip: 'Schwa' },
            { type: 'button', id: 'undertie', text: '‿', tooltip: 'Undertie' },
            { type: 'button', id: 'squareRoot', text: '√', tooltip: 'Square Root' },
        ],
    ],
    diacriticsGroup: [
        { type: 'button', id: 'graveAccent', text: 'à', tooltip: 'Grave Accent' },
        { type: 'button', id: 'acuteAccent', text: 'á', tooltip: 'Acute Accent' },
        { type: 'button', id: 'circumflexAccent', text: 'â', tooltip: 'Circumflex' },
        { type: 'button', id: 'tildeAccent', text: 'ã', tooltip: 'Tilde' },
        { type: 'button', id: 'diaeresisAccent', text: 'ä', tooltip: 'Diaeresis (Umlaut)' },
        { type: 'button', id: 'macronAccent', text: 'ā', tooltip: 'Macron' },
        { type: 'button', id: 'breveAccent', text: 'ă', tooltip: 'Breve' },
        { type: 'button', id: 'invertedBreveAccent', text: 'ȃ', tooltip: 'Inverted Breve' },
        { type: 'button', id: 'dotAboveAccent', text: 'ȧ', tooltip: 'Dot Above' },
        { type: 'button', id: 'ringAboveAccent', text: 'å', tooltip: 'Ring Above' },
        { type: 'button', id: 'caronAccent', text: 'ǎ', tooltip: 'Caron (Háček)' },
        { type: 'button', id: 'dotBelowAccent', text: 'ạ', tooltip: 'Dot Below' },
        { type: 'button', id: 'macronBelowAccent', text: 'a̱', tooltip: 'Macron Below' },
        { type: 'button', id: 'ringBelowAccent', text: 'ḁ', tooltip: 'Ring Below' },
        { type: 'button', id: 'cedillaAccent', text: 'a̧', tooltip: 'Cedilla' },
        { type: 'button', id: 'circumflexBelowAccent', text: 'a̭', tooltip: 'Circumflex Below' },
        { type: 'button', id: 'breveBelowAccent', text: 'a̮', tooltip: 'Breve Below' },
        { type: 'button', id: 'smoothBreathing', text: 'ὠ', tooltip: 'Smooth Breathing' },
        { type: 'button', id: 'roughBreathing', text: 'ὡ', tooltip: 'Rough Breathing' },
        { type: 'button', id: 'greekPerispomeni', text: 'ῶ', tooltip: 'Perispomeni (Greek Circumflex)' },
        { type: 'button', id: 'iotaSubscript', text: 'ῳ', tooltip: 'Iota Subscript' },
    ],
}
