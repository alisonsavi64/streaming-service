<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Hls from 'hls.js'
import { useContentService } from '../../../composables/useContentService'

const route = useRoute()
const videoEl = ref<HTMLVideoElement | null>(null)
const videoMeta = ref<any>(null)
let hls: Hls | null = null

onMounted(async () => {
  const id = route.params.id
  if (!id || Array.isArray(id)) return
  try {
    const meta = await useContentService().show(id)
    videoMeta.value = meta
    const { manifestUrl } = await fetch(
      `http://video-streaming:3003/stream/${id}`
    ).then(r => r.json())
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(manifestUrl)
      hls.attachMedia(videoEl.value!)
    } else if (videoEl.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.value.src = manifestUrl
    } else {
      console.error('HLS not supported')
    }
  } catch (err) {
    console.error('Failed to load video', err)
  }
})

onBeforeUnmount(() => {
  if (hls) {
    hls.destroy()
  }
})
</script>

<template>
  <div v-if="videoMeta" class="fixed inset-0 bg-black flex justify-center items-center z-50">
    <video
      ref="videoEl"
      autoplay
      controls
      playsinline
      class="w-full h-full object-cover"
    ></video>

    <div class="absolute bottom-12 left-12 text-white z-10">
      <h1 class="text-4xl font-bold drop-shadow-lg mb-2">
        {{ videoMeta.title }}
      </h1>
      <p class="text-lg max-w-xl drop-shadow-md">
        {{ videoMeta.description }}
      </p>
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-screen text-white text-2xl">
    Loading...
  </div>
</template>

