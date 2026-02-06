<script setup lang="ts">
import { useRegister } from '@/composables/useRegister'

const { form, errors, errorMessage, isSubmitting, handleSubmit } = useRegister()
</script>

<template>
  <div class="auth-form auth-form--register">
    <div class="auth-form__card">
      <h2 class="auth-form__title">Регистрация</h2>
      <label class="auth-form__field">
        <span>Username</span>
        <input v-model="form.username" type="text" autocomplete="username" />
        <small v-if="errors.username" class="auth-form__error">{{ errors.username }}</small>
      </label>
      <label class="auth-form__field">
        <span>Password</span>
        <input v-model="form.password" type="password" autocomplete="new-password" />
        <small v-if="errors.password" class="auth-form__error">{{ errors.password }}</small>
      </label>
      <label class="auth-form__field">
        <span>Confirm password</span>
        <input v-model="form.passwordConfirmation" type="password" autocomplete="new-password" />
        <small v-if="errors.passwordConfirmation" class="auth-form__error">
          {{ errors.passwordConfirmation }}
        </small>
      </label>
      <button
        class="auth-form__submit"
        type="button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        Зарегистрироваться
      </button>
      <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>
      <p class="auth-form__hint">Уже есть аккаунт? <RouterLink to="/login">Войти</RouterLink></p>
    </div>
  </div>
</template>
