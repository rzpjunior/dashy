import { mount } from '@vue/test-utils'
import SelectWrt from '@/components/com/SelectWrt.vue'

test('Props wrt', async () => {
  const wrapper = mount(SelectWrt)
  await wrapper.setProps({ wrt: '65536' })
  expect(wrapper.props('wrt')).toBe('65536')
})

test('Props wrt null', async () => {
  const wrapper = mount(SelectWrt)
  await wrapper.setProps({ wrt: null})
  expect(wrapper.props('wrt')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectWrt)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Props area', async () => {
  const wrapper = mount(SelectWrt)
  await wrapper.setProps({ area: '65536' })
  expect(wrapper.props('area')).toBe('65536')
})

test('Emit', async () => {
  const wrapper = mount(SelectWrt)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})