<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  component: any
  source?: string
  title?: string
  description?: string
}>()

const containerRef = ref<HTMLDivElement>()
const showCode = ref(false)
const copied = ref(false)
let root: any = null

function mountReact() {
  if (!containerRef.value || !props.component) return
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then((React) => {
      if (!containerRef.value) return
      root = createRoot(containerRef.value)
      root.render(React.createElement(props.component))
    })
  })
}

function unmountReact() {
  if (root) {
    root.unmount()
    root = null
  }
}

onMounted(() => {
  mountReact()
})

onBeforeUnmount(() => {
  unmountReact()
})

watch(() => props.component, () => {
  unmountReact()
  mountReact()
})

function handleCopy() {
  if (props.source) {
    navigator.clipboard.writeText(props.source).then(() => {
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    })
  }
}
</script>

<template>
  <div class="react-demo">
    <div v-if="title" class="react-demo-title">{{ title }}</div>
    <div v-if="description" class="react-demo-desc">{{ description }}</div>
    <div ref="containerRef" class="react-demo-preview" />
    <div class="react-demo-divider">
      <button class="react-demo-toggle" @click="showCode = !showCode">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        {{ showCode ? '收起代码' : '展开代码' }}
      </button>
    </div>
    <div v-if="showCode && source" class="react-demo-code">
      <button class="react-demo-copy" @click="handleCopy" :title="copied ? '已复制' : '复制代码'">
        <svg v-if="!copied" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
      <pre><code>{{ source.trim() }}</code></pre>
    </div>
  </div>
</template>
