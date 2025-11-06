import { ref } from 'vue';

const isLoggedIn = ref(false);

async function checkSessionStatus() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        isLoggedIn.value = false;
        return false;
    }

    try {
        const response = await fetch('http://localhost:8080/user/info', {
            method: 'HEAD',
            credentials: 'include'
        });

        if (response.ok) {
            if (!isLoggedIn.value) isLoggedIn.value = true;
            return true;
        }

        if (response.status === 401 || response.status === 403) {
            isLoggedIn.value = false;
            localStorage.setItem('isLoggedIn', 'false');
            return false;
        }

        return isLoggedIn.value;

    } catch (error) {
        console.log(error);
        return isLoggedIn.value;
    }
}

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
        checkSessionStatus,
    };
}