import { createRouter, createWebHistory } from 'vue-router';

import HomeView from "@/views/HomeView.vue";
import MarketplaceView from "@/views/MarketplaceView.vue";
import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: MarketplaceView
    },
    {
        path: '/signup',
        name: 'Sign Up',
        component: SignUpView
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;