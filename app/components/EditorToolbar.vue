<template>
    <div class="editor-toolbar">
        <div class="editor-toolbar__row editor-toolbar__row--main">
            <template
                v-for="(group, groupIndex) in items.slice(0, 3)"
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
                    v-if="groupIndex < 2"
                    class="editor-toolbar__divider editor-toolbar__divider--vertical"
                    aria-hidden="true"
                />
            </template>
        </div>

        <div
            class="editor-toolbar__divider editor-toolbar__divider--horizontal"
            aria-hidden="true"
        />

        <div
            v-if="items[3]"
            class="editor-toolbar__row editor-toolbar__row--diacritics"
        >
            <UButton
                v-for="(item, itemIndex) in items[3]"
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
        </div>
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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (min-width: 1480px) {
    .editor-toolbar {
        flex-direction: row;
        align-items: center;
        gap: 0;
    }
}

.editor-toolbar__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.375rem;
}

@media (min-width: 1480px) {
    .editor-toolbar__row {
        flex-wrap: nowrap;
    }
}

.editor-toolbar__button--bold :deep(svg path) {
    stroke-width: 3;
}

.editor-toolbar__divider--vertical {
    width: var(--border-width);
    height: 2.5rem;
    background: var(--workspace-border);
    opacity: 0.75;
    margin: 0 0.5rem;
}

.editor-toolbar__divider--horizontal {
    width: 100%;
    height: var(--border-width);
    background: var(--workspace-border);
    opacity: 0.75;
}

@media (min-width: 1480px) {
    .editor-toolbar__divider--horizontal {
        display: none;
    }

    .editor-toolbar__row--diacritics::before {
        content: '';
        width: var(--border-width);
        height: 2.5rem;
        background: var(--workspace-border);
        opacity: 0.75;
        margin: 0 0.5rem;
    }
}
</style>
