/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
import { mergeProps } from 'vue'
import { twMerge } from 'tailwind-merge'

export const ptViewMerge = (globalPTProps = {} as any, selfPTProps = {} as any, datasets: any) => {
  const { class: globalClass, ...globalRest } = globalPTProps
  const { class: selfClass, ...selfRest } = selfPTProps

  return mergeProps({ class: twMerge(globalClass, selfClass) }, globalRest, selfRest, datasets)
}
