<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-90"
  >
    <button
      v-if="visible"
      @click="scrollToTop"
      class="fixed right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border theme-btn-neutral shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 theme-safe-bottom"
      :style="{ bottom: `${bottomOffset}px` }"
      :aria-label="t('common.backToTop')"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { resolveFloatingActionBottomOffset } from '../composables/useFloatingOffset'

const { t } = useI18n()
const visible = ref(false)
const bottomOffset = ref(80)

const MOBILE_BOTTOM_OFFSET = 80
const DESKTOP_BOTTOM_OFFSET = 24
const FLOATING_BAR_GAP = 16

let domObserver: MutationObserver | null = null
let rafHandle = 0

const updateBottomOffset = () => {
  const defaultBottom = window.innerWidth >= 1024 ? DESKTOP_BOTTOM_OFFSET : MOBILE_BOTTOM_OFFSET

  if (window.innerWidth >= 1024) {
    bottomOffset.value = defaultBottom
    return
  }

  const floatingBars = Array.from(document.querySelectorAll('[data-mobile-floating-bar]'))
  const nextBottom = floatingBars.reduce((maxBottom, element) => {
    if (!(element instanceof HTMLElement)) return maxBottom

    const rect = element.getBoundingClientRect()
    return Math.max(maxBottom, resolveFloatingActionBottomOffset({
      defaultBottom,
      anchorHeight: rect.height,
      anchorBottom: Math.max(window.innerHeight - rect.bottom, 0),
      gap: FLOATING_BAR_GAP,
    }))
  }, defaultBottom)

  bottomOffset.value = nextBottom
}

const scheduleBottomOffsetUpdate = () => {
  if (rafHandle) {
    cancelAnimationFrame(rafHandle)
  }

  rafHandle = requestAnimationFrame(() => {
    rafHandle = 0
    updateBottomOffset()
  })
}

const onScroll = () => {
  visible.value = window.scrollY > 400
  scheduleBottomOffsetUpdate()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  updateBottomOffset()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', scheduleBottomOffsetUpdate, { passive: true })

  const root = document.getElementById('app') || document.body
  domObserver = new MutationObserver(() => {
    scheduleBottomOffsetUpdate()
  })
  domObserver.observe(root, { childList: true, subtree: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', scheduleBottomOffsetUpdate)
  domObserver?.disconnect()
  domObserver = null
  if (rafHandle) {
    cancelAnimationFrame(rafHandle)
    rafHandle = 0
  }
})
</script>
