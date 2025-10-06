import { useAdsStore } from '~/stores/useAds';

export const useOffline = () => {
    const adsStore = useAdsStore();
    const isOffline = ref(false);

    const checkStatus = () => {
        isOffline.value = !navigator.onLine;
        adsStore.checkOnline();
    };

    onMounted(() => {
        window.addEventListener('online', checkStatus);
        window.addEventListener('offline', checkStatus);
        checkStatus();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('online', checkStatus);
        window.removeEventListener('offline', checkStatus);
    });

    return { isOffline };
};