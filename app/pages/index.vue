<script setup lang="ts">
import type { Ad } from '~/types/ads.dto'
import { useAdsStore } from '~/stores/useAds'
import { useOffline } from '~/composables/useOffline'

const adsStore = useAdsStore()
const { filteredAds, filters } = storeToRefs(adsStore)
const { setFilters, updateStatus: storeUpdateStatus, addComment: storeAddComment, generateAds, loadAds } = adsStore

const searchQuery = ref('')
watch(searchQuery, (val) => setFilters({ search: val }))

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Services', value: 'services' }
]
const statuses = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' }
]

const filtersOpen = ref(false)
const selectedAd = ref<Ad | null>(null)
const { isOffline } = useOffline()

const isDesktop = ref(false)
let resizeTimeout: NodeJS.Timeout | undefined

const handleResize = () => {
  if (process.client) {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      isDesktop.value = window.innerWidth >= 1024
    }, 100)
  }
}

const handleUpdateStatus = (id: string, status: 'active' | 'pending') => {
  storeUpdateStatus(id, status)
}

const handleAddComment = (id: string, text: string) => {
  storeAddComment(id, text, 'User')
}

const clearFilters = () => {
  setFilters({
    category: 'all',
    status: 'all',
    location: '',
    minPrice: undefined,
    maxPrice: undefined,
    search: ''
  })
  filtersOpen.value = false
}

onMounted(() => {
  loadAds()
  nextTick(() => {
    console.log('UI updated after load, ads count:', filteredAds.value.length)
  })
  handleResize()
  if (process.client) {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
  if (resizeTimeout) clearTimeout(resizeTimeout)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <!-- Offline Banner -->
    <transition name="fade">
      <div
          v-if="isOffline"
          class="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-400 text-yellow-900 px-4 py-2 flex items-center justify-between z-50"
      >
        <span>You're offline. Data is cached.</span>
        <button
            @click="window.location.reload()"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium"
        >
          Retry
        </button>
      </div>
    </transition>

    <!-- Header -->
    <header class="bg-white shadow-sm h-[60px] px-4 flex justify-between items-center sticky top-0 z-40">
      <input
          v-model="searchQuery"
          type="search"
          placeholder="Search ads..."
          class="border rounded-md px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
          @click="generateAds()"
          class="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Generate New Ads
      </button>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="hidden lg:block w-64 bg-white p-4 border-r h-screen overflow-y-auto">
        <h3 class="font-semibold mb-4">Filters</h3>

        <label class="block text-sm mb-1">Category</label>
        <select
            v-model="filters.category"
            class="border rounded-md w-full mb-2 px-2 py-1 focus:ring-2 focus:ring-blue-400"
        >
          <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>

        <label class="block text-sm mb-1">Location</label>
        <input
            v-model="filters.location"
            type="text"
            placeholder="Location"
            class="border rounded-md w-full mb-2 px-2 py-1 focus:ring-2 focus:ring-blue-400"
        />

        <div class="grid grid-cols-2 gap-2 mb-2">
          <input
              v-model.number="filters.minPrice"
              type="number"
              placeholder="Min"
              class="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400"
          />
          <input
              v-model.number="filters.maxPrice"
              type="number"
              placeholder="Max"
              class="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <label class="block text-sm mb-1">Status</label>
        <select
            v-model="filters.status"
            class="border rounded-md w-full mb-4 px-2 py-1 focus:ring-2 focus:ring-blue-400"
        >
          <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>

        <button
            @click="clearFilters"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md w-full"
        >
          Clear
        </button>
      </aside>

      <!-- Mobile Filters Button -->
      <button
          v-if="!isDesktop"
          @click="filtersOpen = true"
          class="lg:hidden bg-gray-200 px-4 py-2 rounded-md m-4"
      >
        Filters
      </button>

      <!-- Ads List -->
      <main class="p-4 flex-1">
        <div :class="{ 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4': isDesktop, 'space-y-4': !isDesktop }">
          <AdCard
              data-testid="ad-card"
              v-for="ad in filteredAds"
              :key="ad.id"
              :ad="ad"
              @update-status="handleUpdateStatus"
              @open-modal="selectedAd = ad"
              @add-comment="handleAddComment"
          />
        </div>
        <div v-if="filteredAds.length === 0" class="text-center py-8 text-gray-500">
          No ads found. Try generating some!
        </div>
      </main>
    </div>

    <transition name="fade">
      <div
          v-if="filtersOpen"
          class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button
              @click="filtersOpen = false"
              class="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>

          <h3 class="font-semibold mb-4">Filters</h3>

          <label class="block text-sm mb-1">Category</label>
          <select
              v-model="filters.category"
              class="border rounded-md w-full mb-2 px-2 py-1 focus:ring-2 focus:ring-blue-400"
          >
            <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>

          <label class="block text-sm mb-1">Location</label>
          <input
              v-model="filters.location"
              placeholder="Location"
              class="border rounded-md w-full mb-2 px-2 py-1 focus:ring-2 focus:ring-blue-400"
          />

          <div class="grid grid-cols-2 gap-2 mb-2">
            <input
                v-model.number="filters.minPrice"
                type="number"
                placeholder="Min"
                class="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400"
            />
            <input
                v-model.number="filters.maxPrice"
                type="number"
                placeholder="Max"
                class="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <label class="block text-sm mb-1">Status</label>
          <select
              v-model="filters.status"
              class="border rounded-md w-full mb-4 px-2 py-1 focus:ring-2 focus:ring-blue-400"
          >
            <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>

          <button
              @click="clearFilters"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md w-full"
          >
            Clear
          </button>
        </div>
      </div>
    </transition>

    <!-- Ad Modal -->
    <AdModal
        data-testid="ad-modal"
        v-if="selectedAd"
        :ad="selectedAd"
        @close="selectedAd = null"
        @add-comment="handleAddComment"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
