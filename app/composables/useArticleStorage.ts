import { IDB } from '~/services/IDB'
import { createGlobalState } from '@vueuse/core'

export interface IArticleContent {
    json: Record<string, unknown>
    html: string
}

interface IStoredArticle {
    json: Record<string, unknown>
    timestamp: number
}

const key = 'current'

export const useArticleStorage = createGlobalState(() => {
    const content = useState<IArticleContent | null>(`article-${key}`, () => null)
    const isLoading = ref(true)

    const hasActualContent = (json: Record<string, unknown>): boolean => {
        const jsonContent = json.content
        const isArray = Array.isArray(jsonContent)

        return isArray
            ? jsonContent.some((node: unknown) => {
                    if (typeof node !== 'object' || node === null) return true
                    if (!('type' in node) || node.type !== 'paragraph') return true
                    if (!('content' in node) || !Array.isArray(node.content)) return true
                    return node.content.some((child: unknown) => {
                        if (typeof child !== 'object' || child === null) return false
                        if (!('text' in child) || typeof child.text !== 'string') return false
                        return child.text.trim().length > 0
                    })
                })
            : false
    }

    const saveArticle = async (articleContent: IArticleContent): Promise<void> => {
        if (!hasActualContent(articleContent.json)) {
            return
        }

        const article: IStoredArticle = {
            json: toRaw(articleContent.json),
            timestamp: Date.now(),
        }

        await IDB.set('diacritics-editor', 'articles', key, article)
    }

    const loadArticle = async () => {
        try {
            const saved = await IDB.get('diacritics-editor', 'articles', key)
            if (saved && typeof saved === 'object' && 'json' in saved && saved.json && typeof saved.json === 'object') {
                content.value = { json: saved.json as Record<string, unknown>, html: '' }
            }
        }
        catch (error) {
            console.error('Failed to load article:', error)
        }
        finally {
            isLoading.value = false
        }
    }

    onMounted(() => {
        loadArticle()
    })

    watch(content, (newContent) => {
        if (newContent) {
            saveArticle(newContent)
        }
    }, { deep: true })

    return {
        content,
        isLoading,
    }
})
