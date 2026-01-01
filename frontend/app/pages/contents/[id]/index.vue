<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import Hls from 'hls.js'
import { useContentService } from '../../../composables/useContentService'

const route = useRoute()
const videoEl = ref<HTMLVideoElement | null>(null)
const videoMeta = ref<any>(null)

const qualities = ref<{ label: string; level: number }[]>([])
const selectedQuality = ref(-1)

const showControls = ref(true)
const duration = ref(0)
const currentTime = ref(0)

let hls: Hls | null = null
let hideTimeout: number | null = null

const showControlsNow = () => {
  showControls.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = window.setTimeout(() => {
    showControls.value = false
  }, 3000)
}

const togglePlay = () => {
  if (!videoEl.value) return
  videoEl.value.paused ? videoEl.value.play() : videoEl.value.pause()
}

const seek = (seconds: number) => {
  if (!videoEl.value) return
  videoEl.value.currentTime += seconds
}

const onTimeUpdate = () => {
  if (!videoEl.value) return
  currentTime.value = videoEl.value.currentTime
}

const onLoadedMetadata = () => {
  if (!videoEl.value) return
  duration.value = videoEl.value.duration
}

const seekTo = (e: MouseEvent) => {
  if (!videoEl.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  videoEl.value.currentTime = percent * duration.value
}

const changeQuality = (level: number) => {
  if (!hls) return
  hls.currentLevel = level
  selectedQuality.value = level
}

const formatTime = (time: number) => {
  if (!time) return '0:00'
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)

onMounted(async () => {
  const id = route.params.id
  if (!id || Array.isArray(id)) return

  try {
    videoMeta.value = await useContentService().show(id)

    const { manifestUrl } = await fetch(
      `http://localhost:3003/stream/${id}`
    ).then(r => r.json())

    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(manifestUrl)
      hls.attachMedia(videoEl.value!)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        qualities.value = [
          { label: 'Auto', level: -1 },
          ...hls!.levels.map((l, i) => ({
            label: `${l.height}p`,
            level: i
          }))
        ]
      })
    } else if (videoEl.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.value.src = manifestUrl
    }
  } catch (err) {
    console.error(err)
  }
})

onBeforeUnmount(() => {
  hls?.destroy()
  if (hideTimeout) clearTimeout(hideTimeout)
})
</script>

<template>
  <div
    v-if="videoMeta"
    class="fixed inset-0 bg-black z-50"
    @mousemove="showControlsNow"
    @click="showControlsNow"
  >
    <video
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <transition name="fade">
      <button
        v-if="showControls"
        @click.stop="togglePlay"
        class="absolute inset-0 flex items-center justify-center text-white text-7xl"
      >
        <span v-if="videoEl?.paused">▶</span>
        <span v-else>⏸</span>
      </button>
    </transition>

    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white"
      >
        <h1 class="text-2xl font-semibold">{{ videoMeta.title }}</h1>
        <p class="text-sm opacity-70 line-clamp-2">
          {{ videoMeta.description }}
        </p>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white space-y-3"
      >
        <div
          class="h-1 bg-white/30 rounded cursor-pointer"
          @click.stop="seekTo"
        >
          <div
            class="h-1 bg-red-600 rounded"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <div class="flex items-center gap-5">
          <button @click.stop="seek(-10)" class="text-xl">⏪ 10</button>
          <button @click.stop="togglePlay" class="text-2xl">
            <span v-if="videoEl?.paused">▶</span>
            <span v-else>⏸</span>
          </button>
          <button @click.stop="seek(10)" class="text-xl">10 ⏩</button>

          <span class="text-sm opacity-80">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <div class="flex-1"></div>

          <select
            v-model.number="selectedQuality"
            @change="changeQuality(selectedQuality)"
            class="bg-black/60 text-white text-sm rounded px-2 py-1"
          >
            <option
              v-for="q in qualities"
              :key="q.level"
              :value="q.level"
            >
              {{ q.label }}
            </option>
          </select>
        </div>
      </div>
    </transition>
  </div>

  <div v-else class="flex items-center justify-center h-screen text-white">
    Loading...
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
