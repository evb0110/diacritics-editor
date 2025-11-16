type TContentType = 'json' | 'html'

export const useArticleContent = (type: TContentType) => {
    const { content } = useArticleStorage()

    return computed(() => {
        if (type === 'json') {
            return content.value?.json ?? {}
        }
        return content.value?.html ?? '<p></p>'
    })
}
