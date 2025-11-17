<template>
    <div class="editor-toolbar flex items-center flex-wrap gap-1.5 lg:flex-nowrap lg:overflow-x-auto">
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
                :style="getButtonStyle(item)"
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

const baseButtonStyle = {
    width: '2.5rem',
    height: '2.5rem',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
}

const textButtonStyle = {
    ...baseButtonStyle,
    fontSize: '1.25rem',
    fontFamily: 'Helvetica',
}

const getButtonStyle = (item: IToolbarButton) => {
    return item.text ? textButtonStyle : baseButtonStyle
}

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
    padding: 0 var(--workspace-card-header-padding-x);
    min-height: var(--workspace-card-header-min-height);
}

.editor-toolbar__button--bold :deep(svg path) {
    stroke-width: 3;
}

.editor-toolbar__divider {
    width: var(--border-width);
    background: var(--workspace-border);
    opacity: 0.75;
}
</style>
