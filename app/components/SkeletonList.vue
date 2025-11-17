<template>
    <div class="space-y-4 w-full">
        <USkeleton
            v-for="(skeleton, index) in skeletons"
            :key="index"
            :class="[skeleton.height, skeleton.width]"
        />
    </div>
</template>

<script setup lang="ts">
interface IProps {
    totalHeight: number
}

interface ISkeleton {
    height: string
    width: string
    heightPx: number
}

const props = defineProps<IProps>()

const heightClasses = [
    { class: 'h-4', px: 16 },
    { class: 'h-6', px: 24 },
    { class: 'h-8', px: 32 },
]

const widthClasses = [
    'w-1/2',
    'w-3/4',
    'w-4/5',
    'w-5/6',
    'w-full',
]

function getRandomItem<T>(array: T[]): T {
    const index = Math.floor(Math.random() * array.length)
    const item = array[index]
    if (item === undefined) {
        throw new Error('Cannot get random item from empty array')
    }
    return item
}

const skeletons = useState('skeletons', () => {
    const result: ISkeleton[] = []
    const gapSize = 16
    let accumulatedHeight = 0

    while (accumulatedHeight < props.totalHeight) {
        const heightConfig = getRandomItem(heightClasses)
        const widthClass = getRandomItem(widthClasses)

        result.push({
            height: heightConfig.class,
            width: widthClass,
            heightPx: heightConfig.px,
        })

        accumulatedHeight += heightConfig.px
        if (result.length > 1) {
            accumulatedHeight += gapSize
        }
    }

    return result
})
</script>
