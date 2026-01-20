import { defineComponent, h, type VNode } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

describe('component test example', (): void => {
  it('can mount components', async (): Promise<void> => {
    const TestComponent = defineComponent({
      setup () {
        return (): VNode => h('div', 'Hello Nuxt!')
      }
    })

    const component = await mountSuspended(TestComponent)

    expect(component.text()).toBe('Hello Nuxt!')
  })
})
