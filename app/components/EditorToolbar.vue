<template>
    <div class="editor-toolbar">
        <div class="editor-toolbar__group editor-toolbar__group--main">
            <template
                v-for="(group, groupIndex) in mainGroups"
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
                    v-if="groupIndex < mainGroups.length - 1"
                    class="editor-toolbar__divider"
                    aria-hidden="true"
                />
            </template>
        </div>

        <div
            class="editor-toolbar__divider--horizontal"
            aria-hidden="true"
        />

        <div
            v-if="diacriticsGroup.length > 0"
            class="editor-toolbar__group editor-toolbar__group--diacritics"
        >
            <UButton
                v-for="(item, itemIndex) in diacriticsGroup"
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
    mainGroups: IToolbarButton[][]
    diacriticsGroup: IToolbarButton[]
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
    padding: 0;
    min-height: var(--workspace-card-header-min-height);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}

.editor-toolbar__group {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.editor-toolbar__group--main {
    flex-shrink: 1;
    flex-wrap: wrap;
    min-width: 0;
}

.editor-toolbar__group--diacritics {
    flex-wrap: wrap;
    position: relative;
}

.editor-toolbar__group--diacritics::before {
    content: '';
    width: var(--border-width);
    height: 2.5rem;
    background: var(--workspace-border);
    opacity: 0.75;
    margin-right: 0.5rem;
    flex-shrink: 0;
    display: none;
}

@media (min-width: 1920px) {
    .editor-toolbar__group--diacritics::before {
        display: block;
    }
}

.editor-toolbar__divider--horizontal {
    width: 100%;
    height: var(--border-width);
    background: var(--workspace-border);
    opacity: 0.75;
    flex-basis: 100%;
    margin: 0;
    display: block;
}

@media (min-width: 1920px) {
    .editor-toolbar__divider--horizontal {
        display: none;
    }
}

.editor-toolbar__button--bold :deep(svg path) {
    stroke-width: 3;
}

.editor-toolbar__divider {
    width: var(--border-width);
    height: 2.5rem;
    background: var(--workspace-border);
    opacity: 0.75;
    margin: 0 0.5rem;
    flex-shrink: 0;
}
</style>
