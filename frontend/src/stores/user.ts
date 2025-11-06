import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuth } from '@/composables/useAuth.js';

export interface UserInfo {
    id: string;
    name: string;
    prename: string;
    surname: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    street: string;
    houseNumber: string;
    plz: number;
    city: string;
    balance: number;
    availableBalance: number;
}

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null);
    const isLoading = ref(false);
    const hasError = ref(false);

    const { isLoggedIn,setLoggedIn } = useAuth();

    async function fetchUserInfo() {
        if (!isLoggedIn.value) {
            userInfo.value = null;
            isLoading.value = false;
            hasError.value = false;
            return;
        }

        if (userInfo.value) return;

        isLoading.value = true;
        hasError.value = false;

        try {
            const response = await fetch('http://localhost:8080/user/info', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                userInfo.value = await response.json() as UserInfo;
            } else if (response.status === 401 || response.status === 403) { // expired/invalid session (401/403)
                setLoggedIn(false);
                hasError.value = false;
                userInfo.value = null;
            } else {
                hasError.value = true;
                userInfo.value = null;
            }
        } catch (error) {
            console.log(error);
            hasError.value = true;
            userInfo.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    function updateUserInfoLocally({ firstName, surname, street, houseNumber, plz, city }: { firstName: string, surname: string, street: string, houseNumber: string, plz: number, city: string }) {
        if (userInfo.value) {
            userInfo.value.prename = firstName;
            userInfo.value.surname = surname;
            userInfo.value.street = street;
            userInfo.value.houseNumber = houseNumber;
            userInfo.value.plz = plz;
            userInfo.value.city = city;
        }
    }

    watch(isLoggedIn, (newStatus) => {
        if (newStatus) {
            fetchUserInfo();
        } else {
            userInfo.value = null;
        }
    }, { immediate: true });


    return {
        userInfo,
        isLoading,
        hasError,
        updateUserInfoLocally,
    };
});