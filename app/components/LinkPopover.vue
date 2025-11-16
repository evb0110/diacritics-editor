<template>
    <UPopover
        v-model:open="isOpen"
        :popper="{ placement: 'bottom-start' }"
    >
        <UButton
            icon="lucide:link"
            size="sm"
            :color="isLinkActive ? 'primary' : 'neutral'"
            :variant="isLinkActive ? 'soft' : 'ghost'"
            :disabled="disabled"
            :class="[
                'editor-toolbar__button',
                getEditorButtonClasses(isLinkActive),
            ]"
            :ui="editorButtonUi"
        />
        <template #content>
            <div class="p-4 w-80">
                <label class="block text-sm font-medium mb-2">
                    URL
                </label>
                <UInput
                    v-model="linkUrl"
                    placeholder="https://example.com"
                    autofocus
                    size="md"
                    class="w-full"
                    @keydown.enter="handleSetLink"
                />

                <div class="flex justify-between gap-3 mt-4">
                    <UButton
                        v-if="isEditingLink"
                        color="error"
                        variant="ghost"
                        size="sm"
                        @click="handleRemoveLink"
                    >
                        Remove
                    </UButton>
                    <div class="flex justify-end gap-3 ml-auto">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            size="sm"
                            @click="handleCancel"
                        >
                            Cancel
                        </UButton>
                        <UButton
                            color="primary"
                            size="sm"
                            :disabled="!linkUrl"
                            @click="handleSetLink"
                        >
                            {{ isEditingLink ? 'Update' : 'Insert' }}
                        </UButton>
                    </div>
                </div>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts">
import { editorButtonUi, getEditorButtonClasses } from '~/utils/editorButtonUi'

interface IProps {
    isLinkActive: boolean
    currentUrl?: string
    disabled?: boolean
}

const props = defineProps<IProps>()

const emit = defineEmits<{
    setLink: [url: string]
    removeLink: []
}>()

const isOpen = ref(false)

const linkUrl = ref('')
const isEditingLink = computed(() => !!props.currentUrl)

const handleCancel = () => {
    isOpen.value = false
}

const handleSetLink = () => {
    if (linkUrl.value) {
        emit('setLink', linkUrl.value)
    }
    isOpen.value = false
}

const handleRemoveLink = () => {
    emit('removeLink')
    isOpen.value = false
}

watch(isOpen, (newIsOpen) => {
    if (newIsOpen) {
        linkUrl.value = props.currentUrl || ''
    }
    else if (!newIsOpen) {
        linkUrl.value = ''
    }
})
</script>
