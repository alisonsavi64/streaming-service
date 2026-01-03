<template>
  <div
    v-if="videoMeta"
    class="fixed inset-0 flex items-center justify-center bg-secondary dark:bg-secondary-dark z-[9999]"
    @mousemove="showControlsNow"
    @click="showControlsNow"
  >
    VIDEO ELEMENT -->
    <video
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain bg-secondary-dark"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    CENTER PLAY/PAUSE BUTTON -->
    <transition name="fade">
      <button
        v-if="showControls"
        @click.stop="togglePlay"
        class="absolute inset-0 flex items-center justify-center text-primary text-7xl bg-black/30 rounded-full hover:bg-black/50 transition"
      >
        <span v-if="videoEl?.paused">▶</span>
        <span v-else>⏸</span>
      </button>
    </transition>

    TOP INFO BAR -->
    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white flex flex-col gap-1 shadow-lg"
      >
        <h1 class="text-3xl font-bold truncate">{{ videoMeta.title }}</h1>
        <p class="text-sm opacity-70 line-clamp-2">{{ videoMeta.description }}</p>
      </div>
    </transition>

    BOTTOM CONTROLS -->
    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white flex flex-col gap-3 shadow-lg rounded-t-2xl"
      >
        PROGRESS BAR -->
        <div
          class="h-2 w-full bg-white/20 rounded cursor-pointer relative overflow-hidden"
          @click.stop="seekTo"
        >
          <div
            class="h-2 bg-gradient-to-r from-primary to-primary rounded transition-all"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        CONTROL ROW -->
        <div class="flex items-center gap-4">
          SEEK BACKWARD -->
          <button
            @click.stop="seek(-10)"
            class="p-2 hover:bg-primary/20 rounded-full transition"
            title="Rewind 10s"
          >⏪</button>

          PLAY/PAUSE -->
          <button
            @click.stop="togglePlay"
            class="p-3 bg-primary/20 hover:bg-primary/40 rounded-full transition text-2xl"
            title="Play/Pause"
          >
            <span v-if="videoEl?.paused">▶</span>
            <span v-else>⏸</span>
          </button>

          SEEK FORWARD -->
          <button
            @click.stop="seek(10)"
            class="p-2 hover:bg-primary/20 rounded-full transition"
            title="Forward 10s"
          >⏩</button>

          TIMESTAMP -->
          <span class="text-sm opacity-80 font-mono">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <div class="flex-1"></div>

          VOLUME CONTROL -->
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            @input="changeVolume(volume)"
            class="w-24 h-1 bg-white/30 rounded-lg accent-primary"
          />

          FULLSCREEN TOGGLE -->
          <button
            @click.stop="toggleFullscreen"
            class="p-2 hover:bg-primary/20 rounded transition"
            title="Fullscreen"
          >
            <span v-if="isFullscreen">🡽</span>
            <span v-else>🡾</span>
          </button>

          QUALITY SELECTOR -->
          <select
            v-model.number="selectedQuality"
            @change="changeQuality(selectedQuality)"
            class="bg-black/60 text-white text-sm rounded-lg px-3 py-1 hover:bg-black/80 transition"
          >
            <option v-for="q in qualities" :key="q.level" :value="q.level">
              {{ q.label }}
            </option>
          </select>
        </div>
      </div>
    </transition>
  </div>

  LOADING STATE -->
  <div v-else class="flex items-center justify-center h-screen text-white text-xl animate-pulse">
    Loading video...
  </div>
</template>

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
const volume = ref(1)
const isFullscreen = ref(false)

let hls: Hls | null = null
let hideTimeout: number | null = null

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
const onTimeUpdate = () => { if (videoEl.value) currentTime.value = videoEl.value.currentTime }
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
