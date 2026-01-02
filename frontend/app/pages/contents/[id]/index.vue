<template>
  <div
    v-if="videoMeta"
    class="fixed inset-0 bg-black z-50 flex items-center justify-center"
    @mousemove="showControlsNow"
    @click="showControlsNow"
  >
    <!-- VIDEO -->
    <video
      ref="videoEl"
      autoplay
      playsinline
      class="w-full h-full object-contain bg-black"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <!-- CENTER PLAY/PAUSE BUTTON -->
    <transition name="fade">
      <button
        v-if="showControls"
        @click.stop="togglePlay"
        class="absolute inset-0 flex items-center justify-center text-white text-7xl bg-black/30 rounded-full hover:bg-black/50 transition"
      >
        <span v-if="videoEl?.paused">▶</span>
        <span v-else>⏸</span>
      </button>
    </transition>

    <!-- TOP INFO BAR -->
    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent text-white flex flex-col gap-1 shadow-lg"
      >
        <h1 class="text-3xl font-bold truncate">{{ videoMeta.title }}</h1>
        <p class="text-sm opacity-70 line-clamp-2">{{ videoMeta.description }}</p>
      </div>
    </transition>

    <!-- BOTTOM CONTROLS -->
    <transition name="fade">
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white flex flex-col gap-3 shadow-lg rounded-t-xl"
      >
        <!-- PROGRESS BAR -->
        <div
          class="h-2 w-full bg-white/20 rounded cursor-pointer relative overflow-hidden"
          @click.stop="seekTo"
        >
          <div
            class="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded transition-all"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <!-- CONTROL ROW -->
        <div class="flex items-center gap-4">
          <!-- SEEK -->
          <button
            @click.stop="seek(-10)"
            class="p-2 hover:bg-white/20 rounded-full transition"
            title="Rewind 10s"
          >
            ⏪
          </button>

          <!-- PLAY/PAUSE -->
          <button
            @click.stop="togglePlay"
            class="p-3 bg-white/20 hover:bg-white/40 rounded-full transition text-2xl"
            title="Play/Pause"
          >
            <span v-if="videoEl?.paused">▶</span>
            <span v-else>⏸</span>
          </button>

          <!-- FORWARD -->
          <button
            @click.stop="seek(10)"
            class="p-2 hover:bg-white/20 rounded-full transition"
            title="Forward 10s"
          >
            ⏩
          </button>

          <!-- TIMESTAMP -->
          <span class="text-sm opacity-80 font-mono">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </span>

          <div class="flex-1"></div>

          <!-- QUALITY SELECTOR -->
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

  <!-- LOADING STATE -->
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
    const { videoStreamHost } = useRuntimeConfig().public
    const { manifestUrl } = await fetch(
      `${videoStreamHost}/stream/${id}`
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
