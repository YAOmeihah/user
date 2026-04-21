<template>
  <div
    id="app"
    :class="route.meta.lockViewport === true
      ? 'h-[100dvh] overflow-hidden theme-page flex flex-col'
      : 'min-h-screen theme-page flex flex-col'"
  >
    <Navbar />
    <main
      :class="route.meta.lockViewport === true
        ? 'flex-1 min-h-0 overflow-hidden pb-14 lg:pb-0'
        : 'flex-1 min-h-0 pb-14 lg:pb-0'"
    >
      <SupportPage
        v-show="route.name === 'support'"
        :active="route.name === 'support'"
      />
      <ErrorBoundary v-if="route.name !== 'support'">
        <RouterView v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </ErrorBoundary>
    </main>
    <Footer v-if="route.meta.hideFooter !== true" />
    <Loading :loading="appStore.loading" />
    <Toast />
    <ConfirmDialog />
    <BackToTop />
    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/app'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Loading from './components/Loading.vue'
import Toast from './components/Toast.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import BackToTop from './components/BackToTop.vue'
import MobileBottomNav from './components/MobileBottomNav.vue'
import SupportPage from './views/Support.vue'

// config 由 router.beforeEach 统一加载，无需在此重复调用
const appStore = useAppStore()
const route = useRoute()
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 200ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
