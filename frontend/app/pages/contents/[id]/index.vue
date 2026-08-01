<template>
  <div
    v-if="videoMeta"
    class="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
    @mousemove="showControlsNow"
    @click="showControlsNow"
  >
    <video
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain bg-black"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <transition name="fade">
      <button
        v-if="showControls"
        @click.stop="togglePlay"
        class="absolute inset-0 flex items-center justify-center text-primary bg-black/20 hover:bg-black/30 transition"
      >
        <span class="p-5 rounded-full bg-black/40">
          <svg v-if="videoEl?.paused" class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        </span>
      </button>
    </transition>

    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white flex flex-col gap-1 shadow-lg"
      >
        <h1 class="text-3xl font-bold truncate">{{ videoMeta.title }}</h1>
        <p class="text-sm opacity-70 line-clamp-2">{{ videoMeta.description }}</p>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white flex flex-col gap-3 shadow-lg rounded-t-2xl"
      >
        <div
          class="h-2 w-full bg-white/20 rounded cursor-pointer relative overflow-hidden"
          @click.stop="seekTo"
        >
          <div
            class="h-2 bg-gradient-to-r from-primary to-primary rounded transition-all"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <div class="flex items-center gap-1.5 sm:gap-3">
          <button
            @click.stop="seek(-10)"
            class="p-2 hover:bg-primary/20 rounded-full transition"
            title="Rewind 10s"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7a6 6 0 11-6 6H4a8 8 0 108-8z" />
            </svg>
          </button>

          <button
            @click.stop="togglePlay"
            class="p-2.5 sm:p-3 bg-primary/20 hover:bg-primary/40 rounded-full transition"
            title="Play/Pause"
          >
            <svg v-if="videoEl?.paused" class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          </button>

          <button
            @click.stop="seek(10)"
            class="p-2 hover:bg-primary/20 rounded-full transition"
            title="Forward 10s"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1l5 5-5 5V7a6 6 0 106 6h2a8 8 0 11-8-8z" />
            </svg>
          </button>

          <span class="text-xs sm:text-sm opacity-80 font-mono whitespace-nowrap">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <div class="flex-1"></div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            @input="changeVolume(volume)"
            class="hidden sm:block w-24 h-1 bg-white/30 rounded-lg accent-primary"
          />

          <button
            @click.stop="toggleFullscreen"
            class="p-2 hover:bg-primary/20 rounded-full transition"
            title="Fullscreen"
          >
            <svg v-if="isFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5m0-4.5h4.5M15 15l5.5 5.5M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 8V4.5A.5.5 0 014.5 4H9m11 4V4.5a.5.5 0 00-.5-.5H15m5 11v3.5a.5.5 0 01-.5.5H15m5-4v3.5m-16-3.5V19.5a.5.5 0 00.5.5H9" />
            </svg>
          </button>

          <select
            v-model.number="selectedQuality"
            @change="changeQuality(selectedQuality)"
            class="hidden sm:block bg-black/60 text-white text-sm rounded-lg px-3 py-1.5 border border-white/10
                   hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option v-for="q in qualities" :key="q.level" :value="q.level">
              {{ q.label }}
            </option>
          </select>
        </div>
      </div>
    </transition>
  </div>
  <div v-else class="flex items-center justify-center h-screen bg-black text-white text-xl animate-pulse">
    {{ t('loading.video') }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Hls from 'hls.js'
import { useContentService } from '../../../composables/useContentService'

const route = useRoute()
const { t } = useI18n()
const contentService = useContentService()
const videoEl = ref<HTMLVideoElement | null>(null)
const videoMeta = ref<any>(null)

const qualities = ref<{ label: string; level: number }[]>([])
const selectedQuality = ref(-1)
const showControls = ref(true)
const duration = ref(0)
const currentTime = ref(0)
const volume = ref(1)
const isFullscreen = ref(false)

let hls: Hls | null = null
let hideTimeout: number | null = null
let hasRegisteredView = false

const showControlsNow = () => {
  showControls.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = window.setTimeout(() => { showControls.value = false }, 3000)
}

const togglePlay = () => {
  if (!videoEl.value) return
  videoEl.value.paused ? videoEl.value.play() : videoEl.value.pause()
}

const seek = (seconds: number) => { if (videoEl.value) videoEl.value.currentTime += seconds }
const onTimeUpdate = () => {
  if (!videoEl.value) return
  currentTime.value = videoEl.value.currentTime
  if (!hasRegisteredView && currentTime.value >= 3) {
    hasRegisteredView = true
    const id = route.params.id
    if (id && !Array.isArray(id)) contentService.registerView(id)
  }
}
const onLoadedMetadata = () => { if (videoEl.value) { duration.value = videoEl.value.duration; videoEl.value.volume = volume.value } }
const seekTo = (e: MouseEvent) => {
  if (!videoEl.value || !duration.value) return
  const bar = e.currentTarget as HTMLElement
  videoEl.value.currentTime = ((e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth) * duration.value
}
const changeQuality = (level: number) => { if (hls) { hls.currentLevel = level; selectedQuality.value = level } }
const changeVolume = (val: number) => { if (videoEl.value) videoEl.value.volume = val }
const formatTime = (time: number) => { const m = Math.floor(time/60); const s = Math.floor(time%60); return `${m}:${s.toString().padStart(2,'0')}` }
const progressPercent = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

const toggleFullscreen = () => {
  if (!videoEl.value) return
  if (!isFullscreen.value) {
    videoEl.value.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

onMounted(async () => {
  const id = route.params.id
  if (!id || Array.isArray(id)) return

  try {
    videoMeta.value = await useContentService().show(id)
    const { videoStreamHost } = useRuntimeConfig().public
    const { manifestUrl } = await fetch(`${videoStreamHost}/stream/${id}`).then(r => r.json())

    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(manifestUrl)
      hls.attachMedia(videoEl.value!)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        qualities.value = [
          { label: 'Auto', level: -1 },
          ...hls!.levels.map((l, i) => ({ label: `${l.height}p`, level: i }))
        ]
      })
    } else if (videoEl.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.value.src = manifestUrl
    }
  } catch (err) { console.error(err) }
})

onBeforeUnmount(() => { hls?.destroy(); if (hideTimeout) clearTimeout(hideTimeout) })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
