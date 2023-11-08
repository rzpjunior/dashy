import { mount } from '@vue/test-utils'
import SelectArchetypeByAlias from '@/components/com/SelectArchetypeByAlias.vue'

test('Props archetype', async () => {
  const wrapper = mount(SelectArchetypeByAlias)
  await wrapper.setProps({ archetype: '65536' })
  expect(wrapper.props('archetype')).toBe('65536')
})

test('Props archetype null', async () => {
  const wrapper = mount(SelectArchetypeByAlias)
  await wrapper.setProps({ archetype: null})
  expect(wrapper.props('archetype')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectArchetypeByAlias)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Emit', async () => {
  const wrapper = mount(SelectArchetypeByAlias)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})