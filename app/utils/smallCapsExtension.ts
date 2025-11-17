import { Mark, mergeAttributes } from '@tiptap/core'

export interface ISmallCapsOptions {
    HTMLAttributes: Record<string, unknown>
}

const smallCapsMap: Record<string, string> = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ',
    i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
    q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
    y: 'ʏ', z: 'ᴢ',
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ',
}

const reverseSmallCapsMap: Record<string, string> = {
    ᴀ: 'a', ʙ: 'b', ᴄ: 'c', ᴅ: 'd', ᴇ: 'e', ꜰ: 'f', ɢ: 'g', ʜ: 'h',
    ɪ: 'i', ᴊ: 'j', ᴋ: 'k', ʟ: 'l', ᴍ: 'm', ɴ: 'n', ᴏ: 'o', ᴘ: 'p',
    ǫ: 'q', ʀ: 'r', ᴛ: 't', ᴜ: 'u', ᴠ: 'v', ᴡ: 'w', ʏ: 'y', ᴢ: 'z',
}

const toSmallCaps = (text: string): string => {
    return text.split('').map(char => smallCapsMap[char] ?? char).join('')
}

const fromSmallCaps = (text: string): string => {
    return text.split('').map(char => reverseSmallCapsMap[char] ?? char).join('')
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        smallCaps: {
            setSmallCaps: () => ReturnType
            toggleSmallCaps: () => ReturnType
            unsetSmallCaps: () => ReturnType
        }
    }
}

export const SmallCaps = Mark.create<ISmallCapsOptions>({
    name: 'smallCaps',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-small-caps]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-small-caps': '' }), 0]
    },

    addCommands() {
        return {
            setSmallCaps: () => ({ commands, state }) => {
                const { selection } = state
                const { from, to } = selection

                if (from !== to) {
                    const selectedText = state.doc.textBetween(from, to)
                    const transformedText = toSmallCaps(selectedText)

                    return commands.insertContentAt(
                        { from, to },
                        transformedText,
                        { updateSelection: true },
                    )
                }

                return commands.setMark(this.name)
            },
            toggleSmallCaps: () => ({ commands, state }) => {
                const isActive = state.selection.$from.marks().some(mark => mark.type.name === this.name)
                const { selection } = state
                const { from, to } = selection

                if (from !== to) {
                    const selectedText = state.doc.textBetween(from, to)
                    const transformedText = isActive ? fromSmallCaps(selectedText) : toSmallCaps(selectedText)

                    return commands.insertContentAt(
                        { from, to },
                        transformedText,
                        { updateSelection: true },
                    )
                }

                return commands.toggleMark(this.name)
            },
            unsetSmallCaps: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },
        }
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-k': () => this.editor.commands.toggleSmallCaps(),
        }
    },

    addInputRules() {
        return []
    },

    onUpdate() {
        const { editor } = this
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        const marks = $from.marks()
        const hasSmallCapsMark = marks.some(mark => mark.type.name === this.name)

        if (hasSmallCapsMark) {
            const text = $from.nodeBefore?.text
            if (text && text.length > 0) {
                const lastChar = text[text.length - 1]
                if (lastChar && /[a-zA-Z]/.test(lastChar)) {
                    const transformedChar = toSmallCaps(lastChar)

                    if (lastChar !== transformedChar) {
                        const from = $from.pos - 1
                        const to = $from.pos

                        editor.chain()
                            .command(({ tr }) => {
                                tr.insertText(transformedChar, from, to)
                                return true
                            })
                            .run()
                    }
                }
            }
        }
    },
})
