<template>
  <div class="space-y-4 pb-36 lg:hidden">
    <div class="rounded-2xl border theme-panel p-4">
      <div class="text-xs font-semibold uppercase tracking-[0.16em] theme-text-muted">
        {{ topLabel }}
      </div>
      <p class="mt-2 text-sm font-semibold theme-text-primary">{{ statusText }}</p>
    </div>

    <section
      v-for="section in sections"
      :key="section.key"
      class="overflow-hidden rounded-2xl border theme-panel"
    >
      <button
        :data-section-toggle="section.key"
        type="button"
        class="flex w-full items-start justify-between gap-3 px-4 py-4 text-left"
        @click="$emit('update:expandedSection', section.key)"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold theme-text-primary">{{ section.title }}</h2>
            <span class="theme-badge theme-badge-neutral">{{ section.badge }}</span>
          </div>
          <div class="mt-2 space-y-1">
            <p
              v-for="line in section.summaryLines"
              :key="`${section.key}-${line}`"
              class="text-sm theme-text-secondary"
            >
              {{ line }}
            </p>
          </div>
          <p v-if="section.softHint" class="mt-2 text-xs text-amber-600 dark:text-amber-300">
            {{ section.softHint }}
          </p>
        </div>
        <span class="text-xs font-semibold theme-text-accent">
          {{ expandedSection === section.key ? collapseLabel : editLabel }}
        </span>
      </button>

      <div
        v-if="expandedSection === section.key"
        class="border-t theme-border px-4 py-4"
      >
        <slot :name="`section-${section.key}`" />
      </div>
    </section>

    <MobileCheckoutStickyBar
      :total-text="totalText"
      :status-text="statusText"
      :action-label="primaryActionLabel"
      :disabled="primaryActionDisabled"
      @primary-action="$emit('primaryAction')"
    />
  </div>
</template>

<script setup lang="ts">
import MobileCheckoutStickyBar from './MobileCheckoutStickyBar.vue'

export interface MobileCheckoutDisplaySection {
  key: string
  title: string
  badge: string
  summaryLines: string[]
  complete: boolean
  recommended: boolean
  softHint: string
}

withDefaults(
  defineProps<{
    sections: MobileCheckoutDisplaySection[]
    expandedSection: string | null
    topLabel?: string
    statusText: string
    totalText: string
    primaryActionLabel: string
    primaryActionDisabled: boolean
    editLabel?: string
    collapseLabel?: string
  }>(),
  {
    topLabel: '当前需要',
    editLabel: '修改',
    collapseLabel: '收起',
  },
)

defineEmits<{
  (e: 'update:expandedSection', value: string): void
  (e: 'primaryAction'): void
}>()
</script>
