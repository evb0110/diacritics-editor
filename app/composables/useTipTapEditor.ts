import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'

export const useTipTapEditor = ({
    content = '<p></p>',
    placeholder = 'Start typing...',
    json = '',
} = {}) => {
    return useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: true, autolink: true }),
            Image.configure({ allowBase64: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({ placeholder }),
        ],
        content: json || content,
        editable: true,
        autofocus: false,
    })
}
