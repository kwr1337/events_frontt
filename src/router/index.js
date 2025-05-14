import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/pages/MainPage.vue";
import SessionsPage from "@/pages/SessionsPage.vue";
import SessionCard from "@/components/Sessions/SessionCard.vue";
import AdminPage from "@/pages/AdminPage.vue";
import LoginForm from "@/components/Admin/LoginForm.vue";
import DirectionEvents from "@/pages/DirectionEvents.vue";
import DirectionsManager from "@/components/Admin/DirectionsManager.vue";
import EventsManager from "@/components/Admin/EventsManager.vue";
import SocialProjectsManager from "@/components/Admin/SocialProjectsManager.vue";
import ActivityDirectionsManager from '@/components/Admin/ActivityDirectionsManager.vue'
import ActivityDirectionPage from '@/pages/ActivityDirectionPage.vue'
import { authService } from '@/services/auth';

const routes = [
    {
        name: 'main',
        path: '/',
        component: MainPage
    },
    {
        name: 'sessions',
        path: '/sessions',
        component: SessionsPage
    },
    {
        path: '/sessions/:id',
        component: SessionCard
    },
    {
        name: 'direction-events',
        path: '/directions/:id/events',
        component: DirectionEvents
    },
    {
        name: 'login',
        path: '/login',
        component: LoginForm
    },
    {
        path: '/admin',
        component: AdminPage,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/admin/directions'
            },
            {
                name: 'admin-directions',
                path: 'directions',
                component: DirectionsManager
            },
            {
                name: 'admin-activity-directions',
                path: 'activity-directions',
                component: ActivityDirectionsManager
            },
            {
                name: 'admin-events',
                path: 'events',
                component: EventsManager
            },
            {
                name: 'admin-social-projects',
                path: 'social-projects',
                component: SocialProjectsManager
            }
        ]
    },
    {
        path: '/activity-directions/:id',
        name: 'activity-direction',
        component: ActivityDirectionPage
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                left: 0,
                top: 120,
                behavior: 'smooth'
            }
        }
    }
})

// Защита роутов, требующих авторизации
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authService.isAuthenticated()) {
            next({ 
                name: 'login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router