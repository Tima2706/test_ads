import { faker } from '@faker-js/faker';
import type { Ad, Filter } from '~/types/ads.dto';

export const useAdsStore = defineStore('ads', () => {
    const ads = reactive<Ad[]>([]);
    const filters = reactive<Filter>({
        category: 'all',
        status: 'all',
        location: '',
        minPrice: undefined,
        maxPrice: undefined,
        search: ''
    });

    const parseDates = (data: any[]): Ad[] =>
        data.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            comments: (item.comments || []).map((c: any) => ({
                ...c,
                createdAt: new Date(c.createdAt)
            }))
        }));

    if (process.client) {
        const savedAds = localStorage.getItem('ads');
        if (savedAds) {
            try {
                ads.splice(0, ads.length, ...parseDates(JSON.parse(savedAds)));
            } catch (e) {
                console.warn('Failed to load ads:', e);
            }
        }

        const savedFilters = localStorage.getItem('filters');
        if (savedFilters) {
            try {
                Object.assign(filters, JSON.parse(savedFilters));
            } catch (e) {
                console.warn('Failed to load filters:', e);
            }
        }
    }

    watch(
        ads,
        (newAds) => {
            if (process.client) {
                localStorage.setItem(
                    'ads',
                    JSON.stringify(
                        newAds.map(ad => ({
                            ...ad,
                            createdAt: ad.createdAt.toISOString(),
                            comments: ad.comments.map(c => ({
                                ...c,
                                createdAt: c.createdAt.toISOString()
                            }))
                        }))
                    )
                );
            }
        },
        { deep: true }
    );

    watch(
        filters,
        (newFilters) => {
            if (process.client) {
                localStorage.setItem('filters', JSON.stringify(newFilters));
            }
        },
        { deep: true }
    );

    const filteredAds = computed(() => {
        return ads.filter(ad => {
            if (filters.search && !ad.title.toLowerCase().includes(filters.search.toLowerCase()) && !ad.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
            if (filters.category !== 'all' && ad.category !== filters.category) return false;
            if (filters.location && !ad.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (filters.minPrice && ad.price < filters.minPrice) return false;
            if (filters.maxPrice && ad.price > filters.maxPrice) return false;
            if (filters.status !== 'all' && ad.status !== filters.status) return false;
            return true;
        });
    });

    const generateAds = (count = 10) => {
        const newAds: Ad[] = [];
        for (let i = 0; i < count; i++) {
            newAds.push({
                id: faker.string.uuid(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                category: faker.helpers.arrayElement(['electronics', 'vehicles', 'real-estate', 'services']),
                price: parseFloat(faker.commerce.price()),
                location: faker.location.city(),
                status: 'active',
                comments: [],
                createdAt: new Date()
            });
        }
        ads.push(...newAds);
    };

    const updateStatus = (id: string, status: 'active' | 'pending') => {
        const ad = ads.find(a => a.id === id);
        if (ad) ad.status = status;
    };

    const addComment = (id: string, text: string, author: string) => {
        const ad = ads.find(a => a.id === id);
        if (ad) {
            ad.comments.push({
                id: faker.string.uuid(),
                text,
                author,
                createdAt: new Date()
            });
        }
    };

    const setFilters = (newFilters: Partial<Filter>) => {
        Object.assign(filters, newFilters);
    };

    const loadAds = () => {
        if (ads.length === 0) generateAds(20);
    };

    const isOffline = ref(false);
    const checkOnline = () => {
        isOffline.value = !navigator.onLine;
        if (!isOffline.value && ads.length === 0) loadAds();
    };

    return {
        ads,
        filteredAds,
        filters,
        generateAds,
        updateStatus,
        addComment,
        setFilters,
        loadAds,
        isOffline,
        checkOnline
    };
});
