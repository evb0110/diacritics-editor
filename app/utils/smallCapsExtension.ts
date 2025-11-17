import { Mark, mergeAttributes } from '@tiptap/core'

export interface ISmallCapsOptions {
    HTMLAttributes: Record<string, unknown>
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
            {
                style: 'font-variant=small-caps',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-small-caps': '' }), 0]
    },

    addCommands() {
        return {
            setSmallCaps: () => ({ commands }) => {
                return commands.setMark(this.name)
            },
            toggleSmallCaps: () => ({ commands }) => {
                return commands.toggleMark(this.name)
            },
            unsetSmallCaps: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },
        }
    },
})
