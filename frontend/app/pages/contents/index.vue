<script setup lang="ts">
const { $api } = useNuxtApp()
const contents = ref<any[]>([])
onMounted(async () => {
  const { data } = await $api.get('/contents')
  contents.value = data
})
</script>
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Vídeos</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="v in contents"
        :key="v.id"
        :to="`/contents/${v.id}`"
        class="group"
      >
        <div class="bg-zinc-900 rounded-xl overflow-hidden">
          <img
            :src="v.thumbnail"
            class="h-40 w-full object-cover group-hover:scale-105 transition"
          />

          <div class="p-4">
            <p class="font-medium group-hover:text-primary">
              {{ v.title }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
