import { ref } from 'vue';

const isLoggedIn = ref(false);

// TODO

export function useAuth() {
    const setLoggedIn = (status: boolean) => {
        isLoggedIn.value = status;
        localStorage.setItem('isLoggedIn', status.toString());
    };

    const initialStatus = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn.value !== initialStatus) {
        isLoggedIn.value = initialStatus;
    }

    return {
        isLoggedIn,
        setLoggedIn,
    };
}