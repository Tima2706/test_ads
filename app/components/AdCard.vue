<template>
  <UCard :ui="{
      root: 'rounded-xl bg-white p-2',
      header: 'text-2xl font-bold text-red-800',
      body: 'text-gray-700',
      footer: 'flex justify-end mt-4'
    }"  @click="$emit('open-modal', ad)">
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-semibold text-lg">{{ ad.title }}</h3>
      <UBadge :color="ad.status === 'active' ? 'green' : 'yellow'" data-testid="ad-status">{{ ad.status }}</UBadge>
    </div>
    <p class="text-sm text-gray-600 mb-2">{{ ad.description.substring(0, 100) }}...</p>
    <div class="flex justify-between text-sm text-gray-500">
      <span>{{ ad.category }} • {{ ad.location }}</span>
      <span>${{ ad.price }}</span>
    </div>
    <div class="mt-4 flex gap-2">
      <UButton size="xs" @click.stop="$emit('update-status', ad.id, ad.status === 'active' ? 'pending' : 'active')" data-testid="toggle-status">
        Toggle Status
      </UButton>
      <UButton size="xs" variant="ghost" @click.stop="$emit('add-comment', ad.id)">Add Comment</UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Ad } from '~/types/ads.dto';

defineProps<{ ad: Ad }>();
const emit = defineEmits<{
  'open-modal': [ad: Ad];
  'update-status': [id: string, status: 'active' | 'pending'];
  'add-comment': [id: string];
}>();
</script>