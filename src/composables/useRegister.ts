import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

export const useRegister = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const form = reactive({
    username: '',
    password: '',
    passwordConfirmation: '',
  })

  const errors = reactive({
    username: '',
    password: '',
    passwordConfirmation: '',
  })

  const errorMessage = ref('')
  const isSubmitting = ref(false)

  const validate = () => {
    const username = form.username.trim()
    const password = form.password
    const hasUppercase = /[A-Z]/.test(password)
    const hasDigit = /\d/.test(password)

    errors.username = username.length >= 8 ? '' : 'Минимум 8 символов'
    errors.password =
      password.length >= 8 && hasUppercase && hasDigit
        ? ''
        : 'Минимум 8 символов, 1 заглавная буква и 1 цифра'
    errors.passwordConfirmation =
      form.passwordConfirmation === password ? '' : 'Пароли должны совпадать'

    return !errors.username && !errors.password && !errors.passwordConfirmation
  }

  const handleSubmit = async () => {
    errorMessage.value = ''
    if (!validate()) {
      return
    }
    isSubmitting.value = true
    try {
      await authStore.register(form.username.trim(), form.password)
      await router.push({ name: 'tickets' })
    } catch {
      errorMessage.value = 'Не удалось зарегистрироваться. Попробуйте позже'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    errorMessage,
    isSubmitting,
    handleSubmit,
  }
}
