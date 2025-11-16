export default defineNuxtPlugin(() => {
    const colorMode = useColorMode()
    const cookie = useCookie('color-mode', {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    })

    watch(() => colorMode.value, (newValue) => {
        cookie.value = newValue
    }, { immediate: true })
})
