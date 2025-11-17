<template>
    <div class="editor-toolbar flex flex-wrap gap-1.5">
        <template
            v-for="(group, groupIndex) in items"
            :key="groupIndex"
        >
            <UButton
                v-for="(item, itemIndex) in group"
                :key="itemIndex"
                :icon="item.icon"
                :color="item.isActive ? 'primary' : 'neutral'"
                :variant="item.isActive ? 'soft' : 'ghost'"
                :disabled="item.isDisabled"
                :class="getButtonClasses(item)"
                :ui="editorButtonUi"
                :style="item.text ? { fontSize: '1.25rem', minWidth: '2.5rem', display: 'inline-flex', justifyContent: 'center', fontFamily: 'Helvetica' } : undefined"
                @click="emit('buttonClick', item.id)"
            >
                {{ item.text }}
            </UButton>
            <div
                v-if="groupIndex < items.length - 1"
                class="editor-toolbar__divider"
                aria-hidden="true"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { editorButtonUi, getEditorButtonClasses } from '~/utils/editorButtonUi'

export interface IToolbarButton {
    type: 'button'
    id: string
    icon?: string
    text?: string
    isActive: boolean
    isDisabled: boolean
    isBold?: boolean
}

interface IProps {
    items: IToolbarButton[][]
}

defineProps<IProps>()

const emit = defineEmits<{
    buttonClick: [id: string]
}>()

const getButtonClasses = (item: IToolbarButton) => {
    const classes = ['editor-toolbar__button']

    if (item.isBold) {
        classes.push('editor-toolbar__button--bold')
    }

    classes.push(getEditorButtonClasses(item.isActive))

    return classes.join(' ')
}
</script>

<style scoped>
.editor-toolbar {
    border-left: none;
    border-right: none;
    border-top: none;
    padding: 0;
    min-height: auto;
}

.editor-toolbar__button--bold :deep(svg path) {
    stroke-width: 3;
}

.editor-toolbar__divider {
    width: var(--border-width);
    background: var(--workspace-border);
    align-self: stretch;
    opacity: 0.75;
}
</style>
