const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

const highlightJson = (code: string) => {
    const tokenRegex
        = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:\s*)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g
    let lastIndex = 0
    let highlighted = ''
    let match: RegExpExecArray | null

    while ((match = tokenRegex.exec(code)) !== null) {
        highlighted += escapeHtml(code.slice(lastIndex, match.index))
        if (match[1]) {
            const isKey = Boolean(match[2])
            highlighted += `<span class="token ${isKey ? 'key' : 'string'}">${escapeHtml(match[1])}</span>`
            if (match[2]) {
                highlighted += `<span class="token punctuation">${escapeHtml(match[2])}</span>`
            }
        }
        else if (match[3]) {
            highlighted += `<span class="token number">${escapeHtml(match[3])}</span>`
        }
        else if (match[4]) {
            const type = match[4] === 'null' ? 'null' : 'boolean'
            highlighted += `<span class="token ${type}">${match[4]}</span>`
        }
        lastIndex = tokenRegex.lastIndex
    }

    highlighted += escapeHtml(code.slice(lastIndex))
    return highlighted
}

const highlightHtmlAttributes = (attrs: string) => {
    const attrRegex = /([^\s=/>]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?/g
    let highlighted = ''
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = attrRegex.exec(attrs)) !== null) {
        highlighted += escapeHtml(attrs.slice(lastIndex, match.index))
        highlighted += `<span class="token attr-name">${escapeHtml(match[1]!)}</span>`
        if (match[2]) {
            highlighted += `<span class="token punctuation">${escapeHtml(match[2])}</span>`
        }
        if (match[3]) {
            highlighted += `<span class="token attr-value">${escapeHtml(match[3])}</span>`
        }
        lastIndex = attrRegex.lastIndex
    }

    highlighted += escapeHtml(attrs.slice(lastIndex))
    return highlighted
}

const highlightHtml = (code: string) => {
    const tagRegex = /<\/?([a-zA-Z0-9-]+)([^<>]*)>/g
    let lastIndex = 0
    let highlighted = ''
    let match: RegExpExecArray | null

    while ((match = tagRegex.exec(code)) !== null) {
        highlighted += escapeHtml(code.slice(lastIndex, match.index))
        const [full, tagName, attrs] = match
        const isClosing = full.startsWith('</')
        const isSelfClosing = full.endsWith('/>')
        let tagHtml = '<span class="token punctuation">&lt;</span>'

        if (isClosing) {
            tagHtml += '<span class="token punctuation">/</span>'
        }

        tagHtml += `<span class="token tag">${tagName}</span>`

        if (attrs && attrs.trim()) {
            let attrContent = attrs.trimEnd()
            let hasTrailingSlash = false

            if (attrContent.endsWith('/')) {
                hasTrailingSlash = true
                attrContent = attrContent.slice(0, -1).trimEnd()
            }

            if (attrContent.length > 0) {
                tagHtml += ' ' + highlightHtmlAttributes(attrContent)
            }

            if (hasTrailingSlash) {
                tagHtml += ' <span class="token punctuation">/</span>'
            }
        }
        else if (isSelfClosing) {
            tagHtml += ' <span class="token punctuation">/</span>'
        }

        tagHtml += '<span class="token punctuation">&gt;</span>'
        highlighted += tagHtml
        lastIndex = tagRegex.lastIndex
    }

    highlighted += escapeHtml(code.slice(lastIndex))
    return highlighted
}

export { escapeHtml, highlightJson, highlightHtml }
