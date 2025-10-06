<template>
  <transition name="fade">
    <div v-if="localOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      sdasadasd
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div :class="['bg-white rounded-xl shadow-xl max-w-2xl w-full p-6', isDesktop ? 'max-h-[80vh] overflow-auto' : 'h-full']">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ ad?.title }}</h2>
            <div class="text-sm text-gray-500">{{ ad?.location }} • ${{ ad?.price }}</div>
          </div>
          <button @click="closeModal" class="text-gray-500">✕</button>
        </div>

        <div class="mt-4 text-gray-700">
          <p>{{ ad?.description }}</p>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>Category: {{ ad?.category }}</div>
          <div>Status: <span :class="ad?.status === 'active' ? 'text-green-600' : 'text-yellow-600'">{{ ad?.status }}</span></div>
          <div>Posted: {{ ad?.createdAt?.toLocaleDateString() }}</div>
          <div>Comments: {{ ad?.comments.length }}</div>
        </div>

        <div class="mt-6">
          <h4 class="font-semibold mb-2">Comments</h4>
          <div v-if="ad?.comments.length === 0" class="text-sm text-gray-400">No comments yet</div>
          <div v-for="c in ad?.comments" :key="c.id" class="border-l-2 pl-3 mb-3">
            <div class="text-sm">{{ c.text }}</div>
            <div class="text-xs text-gray-400">— {{ c.author }} • {{ new Date(c.createdAt).toLocaleString() }}</div>
          </div>

          <div class="mt-3">
            <textarea v-model="newComment" placeholder="Add comment..." class="w-full p-2 border rounded"></textarea>
            <div class="flex gap-2 mt-2">
              <button class="px-3 py-1 bg-primary text-white rounded" @click="submitComment">Submit</button>
              <button class="px-3 py-1 border rounded" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { Ad } from '../types';

const props = defineProps<{ ad: Ad | null }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add-comment', id: string, text: string): void;
}>();

const localOpen = ref(false);
const newComment = ref('');
const isDesktop = ref(true);

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

watch(() => props.ad, (v) => {
  localOpen.value = !!v;
  if (v) {
    newComment.value = '';
    handleResize();
  }
});

watch(localOpen, (val) => {
  if (!val) emit('close');
});

const submitComment = () => {
  if (!props.ad || !newComment.value.trim()) return;
  emit('add-comment', props.ad.id, newComment.value.trim());
  newComment.value = '';
};

const closeModal = () => {
  localOpen.value = false;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
.fade-enter-active,.fade-leave-active{transition:opacity .2s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
