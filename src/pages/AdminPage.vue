<template>
  <div>
    <template v-if="isAuthenticated">
      <div class="admin-page">
        <div class="admin-sidebar">
          <div class="admin-logo">
            <h2>Камалия</h2>
            <p>Панель управления</p>
          </div>
          <nav class="admin-nav">
            <router-link 
              to="/admin/directions" 
              class="nav-item"
              :class="{ active: currentRoute === 'directions' }"
            >
              Направления
            </router-link>
            <router-link 
              to="/admin/events" 
              class="nav-item"
              :class="{ active: currentRoute === 'events' }"
            >
              Мероприятия
            </router-link>
            <router-link 
              to="/admin/social-projects" 
              class="nav-item"
              :class="{ active: currentRoute === 'social-projects' }"
            >
              Социальные проекты
            </router-link>
            <router-link 
              to="/admin/activity-directions" 
              class="nav-item"
              :class="{ active: currentRoute === 'activity-directions' }"
            >
              Направления активности
            </router-link>
          </nav>
          <div class="admin-footer">
            <button @click="logout" class="logout-btn">
              Выйти
            </button>
          </div>
        </div>
        <div class="admin-content">
          <router-view></router-view>
        </div>
      </div>
    </template>
    <LoginForm v-else />
  </div>
</template>

<script>
import LoginForm from "@/components/Admin/LoginForm.vue";
import { authService } from '@/services/auth';

export default {
  name: 'AdminPage',
  components: {
    LoginForm
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  computed: {
    currentRoute() {
      const path = this.$route.path;
      if (path.includes('/admin/directions')) return 'directions';
      if (path.includes('/admin/events')) return 'events';
      if (path.includes('/admin/social-projects')) return 'social-projects';
      if (path.includes('/admin/activity-directions')) return 'activity-directions';
      return '';
    }
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = authService.isAuthenticated();
    },
    async logout() {
      await authService.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  min-height: 100vh;
  background: #162831;
  display: flex;
}

.admin-sidebar {
  width: 250px;
  background: #1E3642;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

.admin-logo {
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    color: #fff;
    font-family: 'El Messiri', serif;
    font-size: 28px;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #018ABE;
    font-size: 14px;
  }
}

.admin-nav {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(1, 138, 190, 0.1);
  }
  
  &.active {
    background: #018ABE;
  }
}

.admin-footer {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid #018ABE;
  color: #018ABE;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #018ABE;
    color: #fff;
  }
}

.admin-content {
  flex-grow: 1;
  margin-left: 250px;
  padding: 2rem;
}
</style>