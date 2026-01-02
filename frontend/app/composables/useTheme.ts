import { ref, onMounted } from 'vue'

const isDark = ref(true)

export const useTheme = () => {
  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')

    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme()
  })

  return { isDark, toggleTheme }
}
