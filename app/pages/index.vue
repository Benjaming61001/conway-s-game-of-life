<template>
  <div class="flex flex-col items-center gap-8">
    <div>
      <p>
        generation: {{ generation }}
      </p>
    </div>
    <div class="size-[60dvh] bg-white flex flex-col select-none">
      <div
        v-for="(row, yPosition) in cells"
        :key="`${yPosition}`"
        class="flex grow">
        <div
          v-for="(column, xPosition) in row"
          :key="`${yPosition}-${xPosition}`"
          :class="{
            'bg-black text-white': column.isAlive,
            'bg-white text-black': !column.isAlive
          }"
          class="border grow border-slate-400/20"
          @mouseenter="toggleCell($event, yPosition, xPosition)" />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <Button
        :label="isPlay
          ? 'Stop'
          : 'Play'"
        pt:label:class="font-bold text-white"
        @click="togglePlay()" />
      <Button
        :disabled="!isPlay"
        :label="isPause
          ? 'Resume'
          : 'Pause'"
        pt:label:class="font-bold text-white"
        @click="togglePause()" />
      <Button
        :disabled="isPlay && !isPause"
        label="Next"
        pt:label:class="font-bold text-white"
        @click="next()" />
      <Button
        label="Reset"
        pt:label:class="font-bold text-white"
        @click="reset()" />
      <Button
        label="Random"
        pt:label:class="font-bold text-white"
        @click="random()" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface ICells {
  isAlive: boolean
  neighborsCount: number
}

const _SIZE = 50
const _SPEED_MS = 25
const _RANDOM_THRESHOLD = 0.6
const cells = ref<ICells[][]>([])
const generation = ref<number>(0)

const interval = ref()
const isPlay = ref(false)
const isPause = ref(false)
const isChange = ref(false)

function toggleCell (
  event: MouseEvent,
  yPosition: number,
  xPosition: number): void {
  if (event.buttons !== 1) return
  if (cells.value?.[yPosition]?.[xPosition] === undefined) return
  cells.value[yPosition][xPosition].isAlive = !cells.value[yPosition][xPosition].isAlive
}

function checkLeftNeighbor (
  cells: ICells[][],
  yPosition: number,
  xPosition: number
): number {
  let count = 0
  const leftPosition = xPosition - 1
  if (!cells?.[yPosition] || leftPosition < 0) return count
  if (cells?.[yPosition]?.[leftPosition]?.isAlive) count++
  return count
}

function checkRightNeighbor (
  cells: ICells[][],
  yPosition: number,
  xPosition: number
): number {
  let count = 0
  const rightPosition = xPosition + 1
  if (!cells?.[yPosition] || rightPosition >= (cells?.[yPosition]?.length || 0)) return count
  if (cells?.[yPosition]?.[rightPosition]?.isAlive) count++
  return count
}

function checkTopNeighbor (
  cells: ICells[][],
  yPosition: number,
  xPosition: number
): number {
  let count = 0
  const topPosition = yPosition - 1
  if (topPosition < 0) return count
  count += checkLeftNeighbor(cells, topPosition, xPosition)
  count += checkRightNeighbor(cells, topPosition, xPosition)
  if (cells?.[topPosition]?.[xPosition]?.isAlive) count++
  return count
}

function checkBottomNeighbor (
  cells: ICells[][],
  yPosition: number,
  xPosition: number
): number {
  let count = 0
  const bottomPosition = yPosition + 1
  if (bottomPosition > (cells.length || 0)) return count
  count += checkLeftNeighbor(cells, bottomPosition, xPosition)
  count += checkRightNeighbor(cells, bottomPosition, xPosition)
  if (cells?.[bottomPosition]?.[xPosition]?.isAlive) count++
  return count
}

function checkNeighbor (
  cells: ICells[][],
  yPosition: number,
  xPosition: number
): {
  isAlive: boolean
  count: number
} {
  let count = 0
  count += checkTopNeighbor(cells, yPosition, xPosition)
  count += checkBottomNeighbor(cells, yPosition, xPosition)
  count += checkLeftNeighbor(cells, yPosition, xPosition)
  count += checkRightNeighbor(cells, yPosition, xPosition)

  return {
    isAlive: !!cells?.[yPosition]?.[xPosition]?.isAlive,
    count
  }
}

function next (): void {
  isChange.value = false
  const result: ICells[][] = JSON.parse(JSON.stringify(cells.value))
  for (let yPosition = 0; yPosition < _SIZE; yPosition++) {
    for (let xPosition = 0; xPosition < _SIZE; xPosition++) {
      const { isAlive, count } = checkNeighbor(cells.value, yPosition, xPosition)
      result[yPosition]![xPosition]!.neighborsCount = count
      if (isAlive) {
        if (count >= 2 && count <= 3) {
          result[yPosition]![xPosition]!.isAlive = true
        } else {
          result[yPosition]![xPosition]!.isAlive = false
          isChange.value = true
        }
      } else {
        if (count === 3) {
          result[yPosition]![xPosition]!.isAlive = true
          isChange.value = true
        }
      }
    }
  }
  cells.value = JSON.parse(JSON.stringify(result))
  generation.value++
  if (!isChange.value) {
    stop()
  }
}

function play (): void {
  isPlay.value = true
  interval.value = setInterval((): void => {
    if (isPause.value) return
    next()
  }, _SPEED_MS)
}

function stop (): void {
  isPlay.value = false
  isPause.value = false
  generation.value = 0
  clearInterval(interval.value)
}

function togglePlay (): void {
  return isPlay.value
    ? stop()
    : play()
}

function togglePause (): void {
  isPause.value = !isPause.value
}

function mapCells (value: () => ICells): ICells[][] {
  const result: ICells[][] = []
  for (let yPosition = 0; yPosition < _SIZE; yPosition++) {
    result.push([])
    for (let xPosition = 0; xPosition < _SIZE; xPosition++) {
      const pushValue = value()
      result[yPosition]!.push(pushValue)
    }
  }
  return result
}

function reset (): void {
  stop()
  const result: ICells[][] = mapCells((): ICells => ({
    isAlive: false,
    neighborsCount: 0
  }))
  cells.value = JSON.parse(JSON.stringify(result))
}

function random (): void {
  stop()
  const result: ICells[][] = mapCells((): ICells => ({
    isAlive: Math.random() >= _RANDOM_THRESHOLD,
    neighborsCount: 0
  }))
  cells.value = JSON.parse(JSON.stringify(result))
}

onMounted(reset)
</script>

<style scoped>

</style>
