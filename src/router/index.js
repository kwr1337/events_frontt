import { createRouter, createWebHistory } from 'vue-router'
import MainPage from "@/pages/MainPage.vue";
import SessionsPage from "@/pages/SessionsPage.vue";
import SessionCard from "@/components/Sessions/SessionCard.vue";
import AdminPage from "@/pages/AdminPage.vue";
import Auth from "@/components/Admin/Auth.vue";
import AddEvent from "@/components/Admin/AddEvent.vue";
import DeleteEvent from "@/components/Admin/DeleteEvent.vue";



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
        name: 'admin',
        path: '/admin',
        component: Auth
    },
    {
        name: 'menu',
        path: '/admin/menu',
        component: AdminPage,
        children: [
            {
                name: 'add' ,
                path: 'add',
                component: AddEvent
            },
            {
                name: 'delete' ,
                path: 'delete',
                component: DeleteEvent
            },
        ]
    },
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
export default router