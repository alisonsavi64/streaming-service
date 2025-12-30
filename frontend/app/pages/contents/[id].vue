<template>
  <div class="max-w-5xl mx-auto space-y-4">
    <h1 class="text-2xl font-bold">{{ video?.title }}</h1>

    <video
      controls
      class="w-full rounded-2xl border border-zinc-800"
    >
      <source :src="video?.url" type="video/mp4" />
    </video>
  </div>
</template>
