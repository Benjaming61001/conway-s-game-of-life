<template>
  <div class="flex flex-col items-center gap-8">
    <div class="bg-white flex flex-col">
      <div
        v-for="(row, xPosition) in data"
        :key="`${xPosition}`"
        class="flex">
        <div
          v-for="(column, yPosition) in row"
          :key="`${xPosition}-${yPosition}`"
          :class="{
            'bg-black': column
          }"
          class="size-4 border border-slate-400"
          @click="toggleCell(xPosition, yPosition)" />
      </div>
    </div>
    <div class="flex gap-4 items-center">
      <Button label="Button" />
      <Button label="Button" />
      <Button label="Button" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const _SIZE = 50
const data = ref<boolean[][]>([])

function toggleCell (xPosition: number, yPosition: number): void {
  if (data.value?.[xPosition]?.[yPosition] === undefined) return
  data.value[xPosition][yPosition] = !data.value[xPosition][yPosition]
}

onMounted((): void => {
  const result = data.value
  for (let i = 0; i < _SIZE; i++) {
    result.push([])
    for (let j = 0; j < _SIZE; j++) {
      result[i]!.push(false)
    }
  }
})
</script>

<style scoped>

</style>
