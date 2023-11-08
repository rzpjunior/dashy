import { mount } from '@vue/test-utils'
import SelectCategory from '@/components/com/SelectCategory.vue'

test('Props category', async () => {
  const wrapper = mount(SelectCategory)
  await wrapper.setProps({ category: '65536' })
  expect(wrapper.props('category')).toBe('65536')
})

test('Props category null', async () => {
  const wrapper = mount(SelectCategory)
  await wrapper.setProps({ category: null})
  expect(wrapper.props('category')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectCategory)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Emit', async () => {
  const wrapper = mount(SelectCategory)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})