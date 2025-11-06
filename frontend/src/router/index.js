import { createRouter, createWebHistory } from 'vue-router';

import HomeView from "@/views/HomeView.vue";
import MarketplaceView from "@/views/MarketplaceView.vue";
import SignUpView from "@/views/SignUpView.vue";
import LoginView from "@/views/LoginView.vue";
import UserSettingsView from "@/views/UserSettingsView.vue";
import MyRequestsView from "@/views/MyRequestsView.vue";
import FavoriteRequestsView from "@/views/FavoriteRequestsView.vue";
import MyAcceptedView from "@/views/MyAcceptedView.vue";

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
        path: '/marketplace/my',
        name: 'My',
        component: MyRequestsView
    },
    {
        path: '/marketplace/favorites',
        name: 'Favorites',
        component: FavoriteRequestsView
    },
    {
        path: '/marketplace/myAccepted',
        name: 'My Accepted',
        component: MyAcceptedView
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
    },
    {
        path: '/user',
        name: 'User',
        component: UserSettingsView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;