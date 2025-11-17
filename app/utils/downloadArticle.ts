import fontRegularUrl from '~/assets/fonts/NotoSans-Regular.ttf?url'
import fontBoldUrl from '~/assets/fonts/NotoSans-Bold.ttf?url'
import fontItalicUrl from '~/assets/fonts/NotoSans-Italic.ttf?url'
import fontBoldItalicUrl from '~/assets/fonts/NotoSans-BoldItalic.ttf?url'
import monoFontUrl from '~/assets/fonts/JetBrainsMono-Regular.ttf?url'
import {
    exportColorTokens,
    type ExportColorValues,
    type ICssVarToken,
} from '~/design-system/tokens'

const readCssVariableValue = (token: ICssVarToken, declaration: CSSStyleDeclaration | null) => {
    if (!declaration) {
        return token.fallback
    }
    const value = declaration.getPropertyValue(token.variable)
    return value?.trim() || token.fallback
}

const resolveCssVariableValues = <T extends Record<string, ICssVarToken>>(tokens: T): { [K in keyof T]: string } => {
    const declaration = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
    return Object.entries(tokens).reduce((acc, [key, token]) => {
        acc[key as keyof T] = readCssVariableValue(token, declaration)
        return acc
    }, {} as { [K in keyof T]: string })
}

const clampColorComponent = (value: number) => Math.max(0, Math.min(255, Math.round(value)))

const parseRgbComponent = (component?: string) => {
    if (!component) return 0
    const trimmed = component.trim()
    if (trimmed.endsWith('%')) {
        const percent = Number.parseFloat(trimmed)
        if (Number.isFinite(percent)) {
            return clampColorComponent((percent / 100) * 255)
        }
        return 0
    }
    const numeric = Number.parseFloat(trimmed)
    return Number.isFinite(numeric) ? clampColorComponent(numeric) : 0
}

const parseCssColor = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.startsWith('#')) {
        let hex = trimmed.slice(1)
        if (hex.length === 3) {
            hex = hex.split('').map(char => `${char}${char}`).join('')
        }
        if (hex.length === 6) {
            return {
                r: Number.parseInt(hex.slice(0, 2), 16),
                g: Number.parseInt(hex.slice(2, 4), 16),
                b: Number.parseInt(hex.slice(4, 6), 16),
            }
        }
    }

    const rgbMatch = trimmed.match(/rgba?\(([^)]+)\)/i)
    if (rgbMatch) {
        const parts = rgbMatch[1]!.split(/[,\s/]+/).filter(Boolean)
        return {
            r: parseRgbComponent(parts[0]),
            g: parseRgbComponent(parts[1]),
            b: parseRgbComponent(parts[2]),
        }
    }

    return { r: 0, g: 0, b: 0 }
}

const colorToHex = (value: string) => {
    const { r, g, b } = parseCssColor(value)
    const toHex = (component: number) => component.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const colorToDocx = (value: string) => colorToHex(value).replace('#', '').toUpperCase()

const colorToPdf = (pdfLib: typeof import('pdf-lib'), value: string) => {
    const { r, g, b } = parseCssColor(value)
    return pdfLib.rgb(r / 255, g / 255, b / 255)
}

export type TExportFormat = 'docx' | 'pdf'

export interface IArticleSnapshot {
    html?: string
}

interface IDownloadOptions {
    format: TExportFormat
    snapshot: IArticleSnapshot
    filename?: string
}

interface IRichTextSegment {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    link?: string
}

type TParagraphBlock = {
    type: 'paragraph'
    segments: IRichTextSegment[]
}

type THeadingBlock = {
    type: 'heading'
    level: number
    segments: IRichTextSegment[]
}

type TListBlock = {
    type: 'list'
    ordered: boolean
    items: IRichTextSegment[][]
}

type TDividerBlock = {
    type: 'divider'
}

type TExportBlock = TParagraphBlock | THeadingBlock | TListBlock | TDividerBlock

const PDF_FONT_URLS = {
    regular: fontRegularUrl,
    bold: fontBoldUrl,
    italic: fontItalicUrl,
    boldItalic: fontBoldItalicUrl,
    mono: monoFontUrl,
} as const

type TPdfFontKey = keyof typeof PDF_FONT_URLS

const pdfFontByteCache: Partial<Record<TPdfFontKey, Promise<Uint8Array>>> = {}

const fetchPdfFontBytes = (font: TPdfFontKey) => {
    if (!pdfFontByteCache[font]) {
        pdfFontByteCache[font] = (async () => {
            if (typeof fetch === 'undefined') {
                throw new Error('Font loading is only supported in the browser context.')
            }

            const response = await fetch(PDF_FONT_URLS[font])
            if (!response.ok) {
                throw new Error(`Failed to load PDF font: ${PDF_FONT_URLS[font]}`)
            }
            const buffer = await response.arrayBuffer()
            return new Uint8Array(buffer)
        })()
    }

    return pdfFontByteCache[font]!
}

const ensureClientEnvironment = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('File downloads are only available in the browser context.')
    }
}
const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    window.setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }, 120)
}

const mergeSegments = (segments: IRichTextSegment[]): IRichTextSegment[] => {
    const merged: IRichTextSegment[] = []

    segments.forEach((segment) => {
        if (!segment.text) return
        const last = merged[merged.length - 1]
        const hasSameStyle
            = last
                && last.bold === segment.bold
                && last.italic === segment.italic
                && last.underline === segment.underline
                && last.strike === segment.strike
                && last.link === segment.link

        if (hasSameStyle) {
            last.text += segment.text
        }
        else {
            merged.push({ ...segment })
        }
    })

    return merged
}

const extractRichTextSegments = (element: Element, options: { preserveWhitespace?: boolean } = {}): IRichTextSegment[] => {
    const segments: IRichTextSegment[] = []

    const appendSegment = (text: string, style: Omit<IRichTextSegment, 'text'>) => {
        if (!text) return
        segments.push({ text, ...style })
    }

    const traverse = (node: Node, activeStyle: Omit<IRichTextSegment, 'text'>, preserveWhitespace: boolean) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const raw = node.textContent ?? ''
            const text = preserveWhitespace ? raw : raw.replace(/\s+/g, ' ')
            if (text) {
                appendSegment(text, activeStyle)
            }
            return
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return
        }

        const elementNode = node as HTMLElement
        const tag = elementNode.tagName.toLowerCase()

        if (tag === 'br') {
            appendSegment('\n', activeStyle)
            return
        }

        const nextStyle = { ...activeStyle }
        if (tag === 'strong' || tag === 'b') {
            nextStyle.bold = true
        }
        if (tag === 'em' || tag === 'i') {
            nextStyle.italic = true
        }
        if (tag === 'u' || tag === 'ins') {
            nextStyle.underline = true
        }
        if (tag === 's' || tag === 'strike' || tag === 'del') {
            nextStyle.strike = true
        }
        if (tag === 'a') {
            const href = elementNode.getAttribute('href')
            if (href) {
                nextStyle.link = href
            }
        }

        const shouldPreserveWhitespace = preserveWhitespace || tag === 'code' || tag === 'pre'
        Array.from(elementNode.childNodes).forEach(child => traverse(child, nextStyle, shouldPreserveWhitespace))
    }

    Array.from(element.childNodes).forEach(child => traverse(child, {}, !!options.preserveWhitespace))

    const normalized = mergeSegments(segments)
    return normalized.length ? normalized : [{ text: '' }]
}

const collectExportBlocks = (html: string): TExportBlock[] => {
    const container = document.createElement('div')
    container.innerHTML = html

    const blocks: TExportBlock[] = []

    const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = (node.textContent ?? '').trim()
            if (text) {
                blocks.push({ type: 'paragraph', segments: [{ text }] })
            }
            return
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return
        }

        const element = node as HTMLElement
        const tag = element.tagName.toLowerCase()

        switch (tag) {
            case 'p':
                blocks.push({ type: 'paragraph', segments: extractRichTextSegments(element) })
                return
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                blocks.push({
                    type: 'heading',
                    level: Number(tag.substring(1)),
                    segments: extractRichTextSegments(element),
                })
                return
            case 'ul':
            case 'ol': {
                const items = Array.from(element.children)
                    .filter(child => child.tagName.toLowerCase() === 'li')
                    .map(child => extractRichTextSegments(child))
                if (items.length) {
                    blocks.push({ type: 'list', ordered: tag === 'ol', items })
                }
                return
            }
            case 'hr':
                blocks.push({ type: 'divider' })
                return
            case 'table': {
                Array.from(element.querySelectorAll('tr')).forEach((row) => {
                    const rowText = Array.from(row.children)
                        .map(cell => extractRichTextSegments(cell).map(segment => segment.text).join(' '))
                        .join(' | ')
                    blocks.push({ type: 'paragraph', segments: [{ text: rowText }] })
                })
                return
            }
            case 'div':
            case 'section':
            case 'article':
            case 'main':
            case 'body':
            case 'header':
            case 'footer':
            case 'aside':
                Array.from(element.childNodes).forEach(processNode)
                return
            default: {
                blocks.push({ type: 'paragraph', segments: extractRichTextSegments(element) })
            }
        }
    }

    Array.from(container.childNodes).forEach(processNode)

    return blocks.length ? blocks : [{ type: 'paragraph', segments: [{ text: '' }] }]
}

const applySegmentDefaults = (segments: IRichTextSegment[], defaults: Partial<Omit<IRichTextSegment, 'text'>> = {}) => {
    return segments.map(segment => ({
        text: segment.text,
        bold: defaults.bold || segment.bold,
        italic: defaults.italic || segment.italic,
        underline: defaults.underline || segment.underline,
        strike: defaults.strike || segment.strike,
        link: segment.link ?? defaults.link,
    }))
}

const createDocxRuns = (
    segments: IRichTextSegment[],
    docxModule: typeof import('docx'),
    defaults: Partial<Omit<IRichTextSegment, 'text'>> = {},
    linkColorHex = '2563EB',
) => {
    const { TextRun, UnderlineType, ExternalHyperlink } = docxModule
    const resolvedSegments = applySegmentDefaults(segments, defaults)
    const children: Array<InstanceType<typeof TextRun> | InstanceType<typeof ExternalHyperlink>> = []

    resolvedSegments.forEach((segment) => {
        const baseOptions: Record<string, unknown> = {}
        if (segment.bold) baseOptions.bold = true
        if (segment.italic) baseOptions.italics = true
        if (segment.strike) baseOptions.strike = true
        if (segment.underline || segment.link) {
            baseOptions.underline = {
                type: UnderlineType.SINGLE,
                color: segment.link ? linkColorHex : undefined,
            }
        }
        if (segment.link) {
            baseOptions.color = linkColorHex
        }

        const parts = segment.text.replace(/\r\n/g, '\n').split('\n')
        const runs: InstanceType<typeof TextRun>[] = []

        parts.forEach((part, index) => {
            runs.push(new TextRun({ text: part, ...baseOptions }))
            if (index < parts.length - 1) {
                runs.push(new TextRun({ text: '', break: 1 }))
            }
        })

        if (segment.link) {
            children.push(new ExternalHyperlink({
                link: segment.link,
                children: runs,
            }))
        }
        else {
            children.push(...runs)
        }
    })

    if (!children.length) {
        children.push(new docxModule.TextRun(' '))
    }

    return children
}

const downloadDocx = async (blocks: TExportBlock[], filename: string, colors: ExportColorValues) => {
    const docxModule = await import('docx')
    const {
        Document,
        Packer,
        Paragraph,
        HeadingLevel,
        AlignmentType,
        LevelFormat,
        BorderStyle,
    } = docxModule

    type THeadingValue = (typeof HeadingLevel)[keyof typeof HeadingLevel]

    const headingMap: Record<number, THeadingValue> = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
    }

    const docElements: Array<InstanceType<typeof Paragraph>> = []
    const linkHex = colorToDocx(colors.link)
    const dividerHex = colorToDocx(colors.divider)

    blocks.forEach((block) => {
        switch (block.type) {
            case 'paragraph':
                docElements.push(new Paragraph({
                    children: createDocxRuns(block.segments, docxModule, {}, linkHex),
                    spacing: { after: 200 },
                }))
                break
            case 'heading': {
                const heading = headingMap[block.level] ?? HeadingLevel.HEADING_3
                docElements.push(new Paragraph({
                    children: createDocxRuns(block.segments, docxModule, {}, linkHex),
                    heading,
                    spacing: { before: 160, after: 160 },
                }))
                break
            }
            case 'list':
                block.items.forEach((item) => {
                    docElements.push(new Paragraph({
                        children: createDocxRuns(item, docxModule, {}, linkHex),
                        numbering: {
                            reference: block.ordered ? 'ordered-list' : 'unordered-list',
                            level: 0,
                        },
                        spacing: { after: 120 },
                    }))
                })
                break
            case 'divider':
                docElements.push(new Paragraph({
                    children: [new docxModule.TextRun('')],
                    border: {
                        bottom: { color: dividerHex, size: 6, space: 1, style: BorderStyle.SINGLE },
                    },
                    spacing: { before: 200, after: 200 },
                }))
                break
        }
    })

    const document = new Document({
        numbering: {
            config: [
                {
                    reference: 'unordered-list',
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: '•',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: {
                                        left: 720,
                                        hanging: 360,
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: 'ordered-list',
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.DECIMAL,
                            text: '%1.',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: {
                                        left: 720,
                                        hanging: 360,
                                    },
                                },
                            },
                        },
                    ],
                },
            ],
        },
        sections: [
            {
                properties: {},
                children: docElements.length ? docElements : [new Paragraph({ children: [new docxModule.TextRun(' ')] })],
            },
        ],
    })

    const blob = await Packer.toBlob(document)
    triggerDownload(blob, `${filename}.docx`)
}

const downloadPdf = async (blocks: TExportBlock[], filename: string, colors: ExportColorValues) => {
    const pdfLib = await import('pdf-lib')
    const pdfDoc = await pdfLib.PDFDocument.create()

    type TPdfFontCollection = Record<TPdfFontKey, import('pdf-lib').PDFFont>

    const loadStandardFonts = () =>
        Promise.all([
            pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica),
            pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold),
            pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaOblique),
            pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBoldOblique),
            pdfDoc.embedFont(pdfLib.StandardFonts.Courier),
        ]).then(([regular, bold, italic, boldItalic, mono]) => ({ regular, bold, italic, boldItalic, mono }))

    const loadCustomFonts = async (): Promise<TPdfFontCollection> => {
        const fontkitModule = await import('@pdf-lib/fontkit')
        const fontkit = (fontkitModule as { default?: unknown }).default ?? fontkitModule
        pdfDoc.registerFontkit(fontkit as Parameters<typeof pdfDoc.registerFontkit>[0])

        const result = {} as TPdfFontCollection
        for (const key of Object.keys(PDF_FONT_URLS) as TPdfFontKey[]) {
            const fontBytes = await fetchPdfFontBytes(key)
            result[key] = await pdfDoc.embedFont(fontBytes, { subset: true })
        }
        return result
    }

    let fonts: TPdfFontCollection
    try {
        fonts = await loadCustomFonts()
    }
    catch (error) {
        console.warn('Failed to load custom fonts for PDF export, falling back to standard fonts.', error)
        fonts = await loadStandardFonts()
    }

    let page = pdfDoc.addPage()
    const margin = 56
    const pdfColorMap = {
        text: colorToPdf(pdfLib, colors.text),
        link: colorToPdf(pdfLib, colors.link),
        divider: colorToPdf(pdfLib, colors.divider),
    }

    const defaultColor = pdfColorMap.text
    const linkColor = pdfColorMap.link
    const maxWidth = page.getWidth() - margin * 2
    let cursorY = page.getHeight() - margin

    const ensureSpace = (height: number) => {
        if (cursorY - height < margin) {
            page = pdfDoc.addPage()
            cursorY = page.getHeight() - margin
        }
    }

    const resolveFont = (segment: IRichTextSegment) => {
        if (segment.bold && segment.italic) return fonts.boldItalic
        if (segment.bold) return fonts.bold
        if (segment.italic) return fonts.italic
        return fonts.regular
    }

    type TPdfTextToken = {
        type: 'text'
        text: string
        font: import('pdf-lib').PDFFont
        fontSize: number
        color: ReturnType<typeof pdfLib.rgb>
        underline?: boolean
        strike?: boolean
        width: number
        ascent: number
        descent: number
        isWhitespace: boolean
        link?: string
    }

    type TPdfToken = TPdfTextToken | { type: 'newline' }

    const buildTokens = (
        segments: IRichTextSegment[],
        options: { defaultStyle?: Partial<Omit<IRichTextSegment, 'text'>>, color?: ReturnType<typeof pdfLib.rgb>, fontSize?: number } = {},
    ): TPdfToken[] => {
        const tokens: TPdfToken[] = []
        const fontSize = options.fontSize ?? 12
        const fallbackAscent = fonts.regular.heightAtSize(fontSize, { descender: false })
        const fallbackDescent = fonts.regular.heightAtSize(fontSize) - fallbackAscent

        segments.forEach((segment) => {
            const applied: IRichTextSegment = {
                text: segment.text,
                bold: options.defaultStyle?.bold || segment.bold,
                italic: options.defaultStyle?.italic || segment.italic,
                underline: options.defaultStyle?.underline || segment.underline,
                strike: options.defaultStyle?.strike || segment.strike,
                link: segment.link ?? options.defaultStyle?.link,
            }

            const segmentColor = applied.link ? linkColor : options.color ?? defaultColor
            const baseFont = resolveFont(applied)
            const fontAscent = baseFont.heightAtSize(fontSize, { descender: false })
            const fontDescent = baseFont.heightAtSize(fontSize) - fontAscent
            const text = applied.text.replace(/\r\n/g, '\n')
            const lines = text.split('\n')

            lines.forEach((line, lineIndex) => {
                if (line) {
                    line.split(/(\s+)/).forEach((part) => {
                        if (!part) return
                        const isWhitespace = /^\s+$/.test(part)
                        const value = isWhitespace ? ' ' : part
                        const width = baseFont.widthOfTextAtSize(value, fontSize)
                        tokens.push({
                            type: 'text',
                            text: value,
                            font: baseFont,
                            fontSize,
                            color: segmentColor,
                            underline: applied.underline || Boolean(applied.link),
                            strike: applied.strike,
                            width,
                            ascent: fontAscent,
                            descent: fontDescent,
                            isWhitespace,
                            link: applied.link,
                        })
                    })
                }

                if (lineIndex < lines.length - 1) {
                    tokens.push({ type: 'newline' })
                }
            })
        })

        if (!tokens.length) {
            tokens.push({
                type: 'text',
                text: ' ',
                font: fonts.regular,
                fontSize,
                color: options.color ?? defaultColor,
                width: fonts.regular.widthOfTextAtSize(' ', fontSize),
                ascent: fallbackAscent,
                descent: fallbackDescent,
                isWhitespace: true,
            })
        }

        return tokens
    }

    const layoutLines = (tokens: TPdfToken[], availableWidth: number) => {
        const lines: TPdfTextToken[][] = []
        const lineWidths: number[] = []
        let currentLine: TPdfTextToken[] = []
        let currentWidth = 0

        const pushLine = () => {
            lines.push(currentLine)
            lineWidths.push(currentWidth)
            currentLine = []
            currentWidth = 0
        }

        tokens.forEach((token) => {
            if (token.type === 'newline') {
                pushLine()
                return
            }

            if (token.isWhitespace && !currentLine.length) {
                return
            }

            if (currentWidth + token.width > availableWidth && currentLine.length) {
                pushLine()
                if (token.isWhitespace) {
                    return
                }
            }

            currentLine.push(token)
            currentWidth += token.width
        })

        if (currentLine.length) {
            pushLine()
        }

        if (!lines.length) {
            lines.push([])
            lineWidths.push(0)
        }

        return { lines, lineWidths }
    }

    const drawRichTextParagraph = (
        segments: IRichTextSegment[],
        options: {
            fontSize?: number
            color?: ReturnType<typeof pdfLib.rgb>
            indent?: number
            spacingBefore?: number
            spacingAfter?: number
            lineHeight?: number
            prefix?: string
            defaultStyle?: Partial<Omit<IRichTextSegment, 'text'>>
            paddingTop?: number
            paddingBottom?: number
            onBeforeDraw?: (details: { height: number, top: number, contentWidth: number }) => void
        } = {},
    ) => {
        const fontSize = options.fontSize ?? 12
        const lineHeight = options.lineHeight ?? fontSize * 1.6
        const indent = options.indent ?? 0
        const spacingBefore = options.spacingBefore ?? 0
        const spacingAfter = options.spacingAfter ?? 0
        const paddingTop = options.paddingTop ?? 0
        const paddingBottom = options.paddingBottom ?? 0
        const defaultAscent = fonts.regular.heightAtSize(fontSize, { descender: false })
        const defaultDescent = fonts.regular.heightAtSize(fontSize) - defaultAscent
        const tokens = buildTokens(segments, { defaultStyle: options.defaultStyle, color: options.color, fontSize })
        const prefixWidth = options.prefix ? fonts.regular.widthOfTextAtSize(options.prefix, fontSize) + 6 : 0
        const { lines, lineWidths } = layoutLines(tokens, maxWidth - indent - prefixWidth)
        const lineMetrics = lines.map((line) => {
            if (!line.length) {
                return { ascent: defaultAscent, descent: defaultDescent }
            }
            return {
                ascent: Math.max(...line.map(token => token.ascent)),
                descent: Math.max(...line.map(token => token.descent)),
            }
        })
        const contentLineCount = Math.max(lineMetrics.length, 1)
        const firstLineAscent = lineMetrics[0]?.ascent ?? defaultAscent
        const lastLineDescent = lineMetrics[lineMetrics.length - 1]?.descent ?? defaultDescent
        const internalSpacing = Math.max(contentLineCount - 1, 0) * lineHeight
        const contentHeight = firstLineAscent + internalSpacing + lastLineDescent
        const blockHeight = paddingTop + contentHeight + paddingBottom

        ensureSpace(spacingBefore + blockHeight + spacingAfter)
        const blockTop = cursorY - spacingBefore
        const contentWidth = lineWidths.length ? Math.max(...lineWidths) : 0
        options.onBeforeDraw?.({ height: blockHeight, top: blockTop, contentWidth })
        cursorY -= spacingBefore + paddingTop + firstLineAscent

        lines.forEach((line, lineIndex) => {
            const baseX = margin + indent
            let cursorX = baseX
            let activeLink: { url: string, startX: number, endX: number, y: number, height: number } | null = null

            if (options.prefix && lineIndex === 0) {
                page.drawText(options.prefix, {
                    x: baseX,
                    y: cursorY,
                    font: fonts.regular,
                    size: fontSize,
                    color: options.color ?? defaultColor,
                })
                cursorX += prefixWidth
            }

            if (!line.length) {
                cursorY -= lineHeight
                return
            }

            const finalizeActiveLink = () => {
                if (!activeLink) return
                const annotation = pdfDoc.context.obj({
                    Type: 'Annot',
                    Subtype: 'Link',
                    Rect: pdfDoc.context.obj([
                        activeLink.startX,
                        activeLink.y - 2,
                        activeLink.endX,
                        activeLink.y + activeLink.height,
                    ]),
                    Border: pdfDoc.context.obj([0, 0, 0]),
                    A: pdfDoc.context.obj({
                        Type: 'Action',
                        S: 'URI',
                        URI: pdfDoc.context.obj(activeLink.url),
                    }),
                })
                const annotationRef = pdfDoc.context.register(annotation)
                page.node.addAnnot(annotationRef)
                activeLink = null
            }

            line.forEach((token) => {
                page.drawText(token.text, {
                    x: cursorX,
                    y: cursorY,
                    font: token.font,
                    size: token.fontSize,
                    color: token.color,
                })

                if (token.link) {
                    if (!activeLink || activeLink.url !== token.link) {
                        finalizeActiveLink()
                        activeLink = {
                            url: token.link,
                            startX: cursorX,
                            endX: cursorX + token.width,
                            y: cursorY,
                            height: token.fontSize,
                        }
                    }
                    else {
                        activeLink.endX = cursorX + token.width
                        activeLink.y = cursorY
                        activeLink.height = token.fontSize
                    }
                }
                else {
                    finalizeActiveLink()
                }

                if (token.underline) {
                    page.drawLine({
                        start: { x: cursorX, y: cursorY - 2 },
                        end: { x: cursorX + token.width, y: cursorY - 2 },
                        thickness: 0.8,
                        color: token.color,
                    })
                }

                if (token.strike) {
                    page.drawLine({
                        start: { x: cursorX, y: cursorY + token.fontSize * 0.3 },
                        end: { x: cursorX + token.width, y: cursorY + token.fontSize * 0.3 },
                        thickness: 0.8,
                        color: token.color,
                    })
                }

                cursorX += token.width
            })

            finalizeActiveLink()

            cursorY -= lineHeight
        })

        if (lines.length) {
            cursorY += lineHeight - lastLineDescent
        }

        cursorY -= paddingBottom + spacingAfter
    }

    const drawDivider = () => {
        ensureSpace(16)
        page.drawLine({
            start: { x: margin, y: cursorY },
            end: { x: margin + maxWidth, y: cursorY },
            thickness: 1,
            color: pdfColorMap.divider,
        })
        cursorY -= 16
    }

    blocks.forEach((block) => {
        switch (block.type) {
            case 'paragraph':
                drawRichTextParagraph(block.segments, { spacingAfter: 12 })
                break
            case 'heading': {
                const fontSize = block.level === 1 ? 18 : block.level === 2 ? 16 : 14
                drawRichTextParagraph(block.segments, {
                    fontSize,
                    spacingBefore: 8,
                    spacingAfter: 8,
                    lineHeight: fontSize * 1.3,
                })
                break
            }
            case 'list': {
                block.items.forEach((item, index) => {
                    drawRichTextParagraph(item, {
                        indent: 14,
                        prefix: block.ordered ? `${index + 1}.` : '•',
                        spacingAfter: 6,
                    })
                })
                cursorY -= 4
                break
            }
            case 'divider':
                drawDivider()
                break
        }
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
    triggerDownload(blob, `${filename}.pdf`)
}

export const downloadArticle = async ({ format, snapshot, filename = 'article' }: IDownloadOptions): Promise<void> => {
    ensureClientEnvironment()
    const exportColors: ExportColorValues = resolveCssVariableValues(exportColorTokens)
    const htmlContent = snapshot.html ?? '<p></p>'
    const exportBlocks = collectExportBlocks(htmlContent)

    switch (format) {
        case 'docx':
            await downloadDocx(exportBlocks, filename, exportColors)
            return
        case 'pdf':
            await downloadPdf(exportBlocks, filename, exportColors)
            return
    }
}
