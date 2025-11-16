<template>
    <div class="editor-toolbar flex flex-wrap gap-1.5">
        <template
            v-for="(group, groupIndex) in items"
            :key="groupIndex"
        >
            <template
                v-for="(item, itemIndex) in group"
                :key="itemIndex"
            >
                <UButton
                    v-if="item.type === 'button'"
                    :icon="item.icon"
                    :color="item.isActive ? 'primary' : 'neutral'"
                    :variant="item.isActive ? 'soft' : 'ghost'"
                    :disabled="item.isDisabled"
                    :class="getButtonClasses(item)"
                    :ui="editorButtonUi"
                    @click="emit('buttonClick', item.id)"
                />
                <LinkPopover
                    v-else-if="item.type === 'link-popover'"
                    :is-link-active="item.isActive"
                    :current-url="item.currentUrl"
                    :disabled="item.isDisabled"
                    @set-link="emit('setLink', $event)"
                    @remove-link="emit('removeLink')"
                />
            </template>
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
    icon: string
    isActive: boolean
    isDisabled: boolean
    isBold?: boolean
}

export interface IToolbarLinkPopover {
    type: 'link-popover'
    isActive: boolean
    currentUrl?: string
    isDisabled: boolean
}

type TToolbarItem = IToolbarButton | IToolbarLinkPopover

interface IProps {
    items: TToolbarItem[][]
}

defineProps<IProps>()

const emit = defineEmits<{
    buttonClick: [id: string]
    setLink: [url: string]
    removeLink: []
}>()

const getButtonClasses = (item: IToolbarButton): string => {
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
    padding: var(--workspace-card-header-padding-y) var(--workspace-card-header-padding-x);
    min-height: var(--workspace-card-header-min-height);
}

.editor-toolbar__button--bold :deep(svg path) {
    stroke-width: 3.5;
}

.editor-toolbar__divider {
    width: var(--border-width);
    background: var(--workspace-border);
    align-self: stretch;
    opacity: 0.75;
}
</style>
