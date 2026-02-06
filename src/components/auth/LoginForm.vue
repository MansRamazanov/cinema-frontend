<script setup lang="ts">
import { useLogin } from '@/composables/useLogin'

const { form, errors, errorMessage, isSubmitting, handleSubmit } = useLogin()
</script>

<template>
  <div class="auth-form auth-form--login">
    <div class="auth-form__card">
      <h2 class="auth-form__title">Вход</h2>
      <label class="auth-form__field">
        <span>Username</span>
        <input v-model="form.username" type="text" autocomplete="username" />
        <small v-if="errors.username" class="auth-form__error">{{ errors.username }}</small>
      </label>
      <label class="auth-form__field">
        <span>Password</span>
        <input v-model="form.password" type="password" autocomplete="current-password" />
        <small v-if="errors.password" class="auth-form__error">{{ errors.password }}</small>
      </label>
      <button
        class="auth-form__submit"
        type="button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        Войти
      </button>
      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>
      <p class="auth-form__hint">
        Нет аккаунта? <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </div>
  </div>
</template>
