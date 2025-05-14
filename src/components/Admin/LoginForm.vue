<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <Title>Авторизация</Title>
      <div class="form-group">
        <label>Логин:</label>
        <input v-model="username" type="text" required>
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <input v-model="password" type="password" required>
      </div>
      <div class="error-message" v-if="error">{{ error }}</div>
      <MyButton type="submit">Войти</MyButton>
    </form>
  </div>
</template>

<script>
import { authService } from '@/services/auth';
import Title from "@/components/UI/Title.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  name: 'LoginForm',
  components: {
    Title,
    MyButton
  },
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        this.error = '';
        await authService.login(this.username, this.password);
        const redirectPath = this.$route.query.redirect || '/admin';
        this.$router.push(redirectPath);
      } catch (error) {
        this.error = 'Неверный логин или пароль';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #162831;
}

.login-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  color: white;
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-family: El Messiri, serif;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: white;

    &:focus {
      outline: none;
      border-color: #018ABE;
    }
  }
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}
</style> 