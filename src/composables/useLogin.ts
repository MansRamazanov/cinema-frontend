import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

export const useLogin = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const form = reactive({
    username: '',
    password: '',
  })

  const errors = reactive({
    username: '',
    password: '',
  })

  const errorMessage = ref('')
  const isSubmitting = ref(false)

  const validate = () => {
    errors.username = form.username.trim().length ? '' : 'Введите имя пользователя'
    errors.password = form.password.length ? '' : 'Введите пароль'
    return !errors.username && !errors.password
  }

  const handleSubmit = async () => {
    errorMessage.value = ''
    if (!validate()) {
      return
    }
    isSubmitting.value = true
    try {
      await authStore.login(form.username.trim(), form.password)
      await router.push({ name: 'tickets' })
    } catch {
      errorMessage.value =
        'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова'
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
