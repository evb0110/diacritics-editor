export interface ICssVarToken {
    variable: `--${string}`
    fallback: string
}

export const brandPalette = {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
} as const

export const accentPalette = {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
} as const

export const neutralPalette = {
    0: '#ffffff',
    25: '#f8fafc',
    50: '#f1f5f9',
    100: '#e2e8f0',
    200: '#cbd5e1',
    300: '#94a3b8',
    400: '#64748b',
    500: '#475569',
    600: '#334155',
    700: '#1e293b',
    800: '#0f172a',
    900: '#020617',
} as const

export const warningPalette = {
    100: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    600: '#c2410c',
} as const

export const dangerPalette = {
    100: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    600: '#b91c1c',
} as const

export const themeColor = brandPalette[600]

type CssVariableMap = Record<`--${string}`, string>

const tint = (colorVar: string, weight: number) => `color-mix(in oklch, ${colorVar} ${weight}%, transparent)`
const mix = (foreground: string, background: string, weight: number) =>
    `color-mix(in oklch, ${foreground} ${weight}%, ${background})`

const brandColor = (shade: keyof typeof brandPalette) => `var(--color-brand-${shade}, ${brandPalette[shade]})`

const brand = {
    strong: brandColor(600),
    base: brandColor(500),
    soft: brandColor(400),
}

const surfaces = {
    app: '#eaf1ff',
    card: neutralPalette[0],
    muted: '#f9faff',
    inverted: neutralPalette[900],
    text: neutralPalette[800],
    textMuted: neutralPalette[500],
    border: '#cfdbf5',
    borderStrong: '#b1c3e5',
}

const neutral = {
    400: neutralPalette[400],
    500: neutralPalette[500],
    600: neutralPalette[600],
    700: neutralPalette[700],
    800: neutralPalette[800],
} as const

const brandColorVars: CssVariableMap = {
    '--color-brand-400': brandPalette[400],
    '--color-brand-500': brandPalette[500],
    '--color-brand-600': brandPalette[600],
}

const surfaceVars: CssVariableMap = {
    '--surface-app': surfaces.app,
    '--surface-card': surfaces.card,
    '--surface-muted': surfaces.muted,
    '--text-primary': surfaces.text,
    '--text-muted': surfaces.textMuted,
    '--link-color': brand.strong,
    '--link-color-hover': brand.base,
}

const workspaceVars: CssVariableMap = {
    '--workspace-bg': 'var(--surface-card)',
    '--workspace-muted': 'var(--surface-muted)',
    '--workspace-border': surfaces.border,
    '--workspace-border-strong': surfaces.borderStrong,
    '--workspace-text': 'var(--text-primary)',
    '--workspace-muted-text': 'var(--text-muted)',
}

const typographyVars: CssVariableMap = {
    '--font-family-base': '\'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', system-ui, sans-serif',
    '--font-size-code': '0.9rem',
    '--code-letter-spacing': '0.01em',
    '--code-line-height': '1.6',
    '--editor-body-line-height': '1.5',
    '--editor-heading-1-size': '1.875rem',
    '--editor-heading-2-size': '1.5rem',
    '--editor-heading-3-size': '1.25rem',
}

const structureVars: CssVariableMap = {
    '--border-width': '1px',
    '--workspace-card-radius': '1rem',
    '--workspace-card-header-padding-x': '1rem',
    '--workspace-card-header-padding-y': '0.75rem',
    '--workspace-card-header-min-height': '3.5rem',
    '--code-display-max-height': '26rem',
    '--code-display-min-height': '16rem',
    '--scrollbar-size': '0.5rem',
    '--scrollbar-thumb-radius': '9999px',
}

const editorVars: CssVariableMap = {
    '--editor-list-indent': '1.5rem',
    '--editor-list-margin': '0.75rem',
    '--editor-list-item-margin': '0.25rem',
    '--editor-inline-code-padding-y': '0.25rem',
    '--editor-inline-code-padding-x': '0.5rem',
    '--editor-inline-code-radius': '0.375rem',
    '--editor-blockquote-padding-left': '1rem',
    '--editor-blockquote-border-width': '4px',
    '--editor-blockquote-spacing': '0.75rem',
    '--editor-table-cell-padding-y': '0.5rem',
    '--editor-table-cell-padding-x': '0.75rem',
    '--editor-media-radius': '0.75rem',
    '--editor-divider-spacing': '1.5rem',
}

const codeVars: CssVariableMap = {
    '--code-block-bg': 'var(--workspace-bg)',
    '--code-block-text': 'var(--workspace-text)',
    '--code-token-key': brand.strong,
    '--code-token-tag': brand.base,
    '--code-token-string': mix('oklch(76% 0.17 160)', 'var(--workspace-text)', 65),
    '--code-token-number': mix('oklch(75% 0.18 85)', 'var(--workspace-text)', 60),
    '--code-token-boolean': mix('oklch(68% 0.15 50)', 'var(--workspace-text)', 60),
    '--code-token-null': neutral[500],
    '--code-token-punctuation': neutral[400],
    '--code-token-attr-name': mix('oklch(65% 0.2 305)', 'var(--workspace-text)', 60),
    '--code-token-attr-value': mix(brand.soft, 'var(--workspace-text)', 55),
}

const buttonVars: CssVariableMap = {
    '--button-ghost-hover-bg': 'rgb(59 130 246 / 0.14)',
}

const toolbarVars: CssVariableMap = {
    '--editor-toolbar-button-fg': 'var(--workspace-text)',
    '--editor-toolbar-button-hover-bg': 'var(--button-ghost-hover-bg)',
    '--editor-toolbar-button-active-bg': tint(brand.strong, 18),
    '--editor-toolbar-button-active-fg': 'var(--link-color)',
    '--editor-toolbar-button-active-hover-bg': tint(brand.soft, 28),
}

const panelVars: CssVariableMap = {
    '--panel-padding': '0.75rem',
    '--panel-gap': '0.75rem',
    '--panel-button-gap': '0.5rem',
    '--panel-button-min-width': '4.5rem',
    '--panel-font-size': '0.875rem',
}

const layoutVars: CssVariableMap = {
    '--elevation-card': '0 1px 4px rgb(15 23 42 / 0.08)',
    '--layout-background-gradient': 'none',
}

const darkModeOverrides: CssVariableMap = {
    '--surface-app': neutralPalette[900],
    '--surface-card': neutralPalette[800],
    '--surface-muted': neutralPalette[700],
    '--text-primary': neutralPalette[50],
    '--text-muted': neutralPalette[300],
    '--link-color': brandColor(400),
    '--link-color-hover': brandColor(300),
    '--workspace-bg': 'var(--surface-card)',
    '--workspace-muted': 'var(--surface-muted)',
    '--workspace-border': neutralPalette[600],
    '--workspace-border-strong': neutralPalette[500],
    '--workspace-text': 'var(--text-primary)',
    '--workspace-muted-text': 'var(--text-muted)',
    '--code-block-bg': 'var(--surface-card)',
    '--code-block-text': 'var(--text-primary)',
    '--code-token-key': brandColor(300),
    '--code-token-tag': brandColor(200),
    '--code-token-string': accentPalette[200],
    '--code-token-number': dangerPalette[300],
    '--code-token-boolean': warningPalette[300],
    '--code-token-null': neutralPalette[300],
    '--code-token-punctuation': neutralPalette[400],
    '--code-token-attr-name': '#d8b4fe',
    '--code-token-attr-value': accentPalette[200],
    '--editor-toolbar-button-active-bg': 'rgb(96 165 250 / 0.22)',
    '--editor-toolbar-button-active-fg': brandColor(200),
    '--editor-toolbar-button-active-hover-bg': 'rgb(96 165 250 / 0.32)',
    '--button-ghost-hover-bg': 'rgb(148 163 184 / 0.2)',
    '--layout-background-gradient': 'none',
    '--export-page-bg': neutralPalette[900],
    '--export-card-bg': neutralPalette[800],
    '--export-text': neutralPalette[50],
    '--export-muted-text': neutralPalette[300],
    '--export-blockquote-accent': neutralPalette[600],
    '--export-blockquote-bg': neutralPalette[700],
    '--export-blockquote-text': neutralPalette[100],
    '--export-code-panel-bg': neutralPalette[800],
    '--export-code-panel-text': neutralPalette[50],
    '--export-source-bg': neutralPalette[700],
    '--export-source-text': neutralPalette[50],
    '--export-link': brandColor(400),
    '--export-table-border': neutralPalette[600],
    '--export-table-header-bg': neutralPalette[800],
    '--export-table-header-text': neutralPalette[50],
    '--export-table-cell-bg': neutralPalette[800],
    '--export-table-cell-text': neutralPalette[50],
    '--export-code-block-bg': neutralPalette[800],
    '--export-code-block-text': neutralPalette[100],
    '--export-divider': neutralPalette[700],
}

const exportColorVars: CssVariableMap = {
    '--export-page-bg': 'var(--surface-app)',
    '--export-card-bg': 'var(--surface-card)',
    '--export-text': 'var(--text-primary)',
    '--export-muted-text': 'var(--text-muted)',
    '--export-blockquote-accent': 'var(--workspace-border-strong)',
    '--export-blockquote-bg': 'var(--workspace-muted)',
    '--export-blockquote-text': 'var(--workspace-text)',
    '--export-code-panel-bg': mix('var(--workspace-border-strong)', 'var(--workspace-bg)', 70),
    '--export-code-panel-text': 'var(--surface-app)',
    '--export-source-bg': 'var(--workspace-muted)',
    '--export-source-text': 'var(--workspace-text)',
    '--export-link': 'var(--link-color)',
    '--export-table-border': 'var(--workspace-border)',
    '--export-table-header-bg': 'var(--workspace-muted)',
    '--export-table-header-text': 'var(--workspace-text)',
    '--export-table-cell-bg': 'var(--surface-card)',
    '--export-table-cell-text': 'var(--workspace-text)',
    '--export-code-block-bg': 'var(--workspace-muted)',
    '--export-code-block-text': 'var(--workspace-text)',
    '--export-divider': 'var(--workspace-border)',
}

const exportLayoutVars: CssVariableMap = {
    '--export-page-padding-y': '2rem',
    '--export-page-padding-x': '1.5rem',
    '--export-card-max-width': '60rem',
    '--export-card-padding': '2.5rem',
    '--export-card-radius': '1rem',
    '--export-title-size': '1.75rem',
    '--export-title-spacing-bottom': '0.1rem',
    '--export-subtitle-size': '0.95rem',
    '--export-subtitle-spacing-bottom': '2rem',
    '--export-body-font-size': '1rem',
    '--export-body-line-height': '1.6',
    '--export-list-padding': '2rem',
    '--export-blockquote-padding-y': '0.75rem',
    '--export-blockquote-padding-x': '1rem',
    '--export-blockquote-spacing-y': '1.5rem',
    '--export-blockquote-border-width': '4px',
    '--export-code-padding': '1rem',
    '--export-code-radius': '0.75rem',
    '--export-code-font-size': '0.9rem',
    '--export-divider-spacing': '2.5rem',
    '--export-divider-thickness': '1px',
    '--export-code-title-size': '1.25rem',
    '--export-source-padding': '1rem',
    '--export-source-radius': '0.75rem',
    '--export-source-line-height': '1.5',
}

const designTokens: CssVariableMap = {
    ...brandColorVars,
    ...surfaceVars,
    ...workspaceVars,
    ...buttonVars,
    ...typographyVars,
    ...structureVars,
    ...codeVars,
    ...editorVars,
    ...toolbarVars,
    ...panelVars,
    ...layoutVars,
    ...exportColorVars,
    ...exportLayoutVars,
}

const toDeclarationList = (vars: CssVariableMap) => {
    return Object.entries(vars).map(([key, value]) => `    ${key}: ${value};`)
}

const buildCssBlock = (selector: string, declarations: string[]) => {
    if (!declarations.length) {
        return ''
    }
    return `${selector} {\n${declarations.join('\n')}\n}`
}

const rootDeclarations = [
    ...toDeclarationList(designTokens),
    '    color-scheme: light dark;',
]

const darkDeclarations = toDeclarationList(darkModeOverrides)

const bodyDeclarations = [
    '    background-color: var(--surface-app);',
    '    color: var(--text-primary);',
    '    font-family: var(--font-family-base, system-ui, sans-serif);',
    '    font-size: 1rem;',
    '    line-height: 1.5;',
    '    font-weight: 400;',
    '    margin: 0;',
]

export const designSystemCss = [
    buildCssBlock(':root', rootDeclarations),
    buildCssBlock('html.dark', darkDeclarations),
    buildCssBlock('body', bodyDeclarations),
]
    .filter(Boolean)
    .join('\n\n')

const fallbackColors = {
    surfaceApp: '#eaf1ff',
    surfaceCard: '#ffffff',
    surfaceMuted: '#f9faff',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
    textSubtle: '#475569',
    border: '#cfdbf5',
    borderStrong: '#b1c3e5',
    link: '#2563eb',
    cardShadow: '0 1px 4px rgb(15 23 42 / 0.08)',
    codePanelBg: '#0f172a',
    codePanelText: '#f8fafc',
    codeBlockText: '#45546b',
} as const

export const exportColorTokens = {
    pageBackground: { variable: '--export-page-bg', fallback: fallbackColors.surfaceApp },
    cardBackground: { variable: '--export-card-bg', fallback: fallbackColors.surfaceCard },
    cardShadow: { variable: '--elevation-card', fallback: fallbackColors.cardShadow },
    text: { variable: '--export-text', fallback: fallbackColors.textPrimary },
    mutedText: { variable: '--export-muted-text', fallback: fallbackColors.textMuted },
    divider: { variable: '--export-divider', fallback: fallbackColors.border },
    blockquoteAccent: { variable: '--export-blockquote-accent', fallback: fallbackColors.borderStrong },
    blockquoteBackground: { variable: '--export-blockquote-bg', fallback: fallbackColors.surfaceMuted },
    blockquoteText: { variable: '--export-blockquote-text', fallback: fallbackColors.textSubtle },
    codePanelBackground: { variable: '--export-code-panel-bg', fallback: fallbackColors.codePanelBg },
    codePanelText: { variable: '--export-code-panel-text', fallback: fallbackColors.codePanelText },
    sourceBackground: { variable: '--export-source-bg', fallback: fallbackColors.surfaceMuted },
    sourceText: { variable: '--export-source-text', fallback: fallbackColors.textPrimary },
    link: { variable: '--export-link', fallback: fallbackColors.link },
    tableBorder: { variable: '--export-table-border', fallback: fallbackColors.border },
    tableHeaderBackground: { variable: '--export-table-header-bg', fallback: fallbackColors.surfaceApp },
    tableHeaderText: { variable: '--export-table-header-text', fallback: fallbackColors.textPrimary },
    tableCellBackground: { variable: '--export-table-cell-bg', fallback: fallbackColors.surfaceCard },
    tableCellText: { variable: '--export-table-cell-text', fallback: fallbackColors.textPrimary },
    codeBlockBackground: { variable: '--export-code-block-bg', fallback: fallbackColors.surfaceMuted },
    codeBlockText: { variable: '--export-code-block-text', fallback: fallbackColors.codeBlockText },
} as const satisfies Record<string, ICssVarToken>

export type ExportColorTokens = typeof exportColorTokens

export type ExportColorValues = {
    [K in keyof ExportColorTokens]: string
}

export const exportLayoutTokens = {
    pagePaddingY: { variable: '--export-page-padding-y', fallback: '2rem' },
    pagePaddingX: { variable: '--export-page-padding-x', fallback: '1.5rem' },
    cardMaxWidth: { variable: '--export-card-max-width', fallback: '60rem' },
    cardPadding: { variable: '--export-card-padding', fallback: '2.5rem' },
    cardRadius: { variable: '--export-card-radius', fallback: '1rem' },
    titleSize: { variable: '--export-title-size', fallback: '1.75rem' },
    titleSpacingBottom: { variable: '--export-title-spacing-bottom', fallback: '0.1rem' },
    subtitleSize: { variable: '--export-subtitle-size', fallback: '0.95rem' },
    subtitleSpacingBottom: { variable: '--export-subtitle-spacing-bottom', fallback: '2rem' },
    bodyFontSize: { variable: '--export-body-font-size', fallback: '1rem' },
    bodyLineHeight: { variable: '--export-body-line-height', fallback: '1.6' },
    listPadding: { variable: '--export-list-padding', fallback: '2rem' },
    blockquotePaddingY: { variable: '--export-blockquote-padding-y', fallback: '0.75rem' },
    blockquotePaddingX: { variable: '--export-blockquote-padding-x', fallback: '1rem' },
    blockquoteSpacingY: { variable: '--export-blockquote-spacing-y', fallback: '1.5rem' },
    blockquoteBorderWidth: { variable: '--export-blockquote-border-width', fallback: '4px' },
    codePadding: { variable: '--export-code-padding', fallback: '1rem' },
    codeRadius: { variable: '--export-code-radius', fallback: '0.75rem' },
    codeFontSize: { variable: '--export-code-font-size', fallback: '0.9rem' },
    dividerSpacing: { variable: '--export-divider-spacing', fallback: '2.5rem' },
    dividerThickness: { variable: '--export-divider-thickness', fallback: '1px' },
    codeTitleSize: { variable: '--export-code-title-size', fallback: '1.25rem' },
    sourcePadding: { variable: '--export-source-padding', fallback: '1rem' },
    sourceRadius: { variable: '--export-source-radius', fallback: '0.75rem' },
    sourceLineHeight: { variable: '--export-source-line-height', fallback: '1.5' },
} as const satisfies Record<string, ICssVarToken>

export type ExportLayoutTokens = typeof exportLayoutTokens

export type ExportLayoutValues = {
    [K in keyof ExportLayoutTokens]: string
}
