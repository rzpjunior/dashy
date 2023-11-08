import { mount } from '@vue/test-utils'
import SelectBranch from '@/components/com/SelectBranch.vue'

test('Props branch', async () => {
  const wrapper = mount(SelectBranch)
  await wrapper.setProps({ branch: '65536' })
  expect(wrapper.props('branch')).toBe('65536')
})

test('Props branch null', async () => {
  const wrapper = mount(SelectBranch)
  await wrapper.setProps({ branch: null})
  expect(wrapper.props('branch')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectBranch)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Props merchant', async () => {
  const wrapper = mount(SelectBranch)
  await wrapper.setProps({ merchant: '65536' })
  expect(wrapper.props('merchant')).toBe('65536')
})

test('Props merchant', async () => {
  const wrapper = mount(SelectBranch)
  await wrapper.setProps({ merchant: null })
  expect(wrapper.props('merchant')).toBe(null)
})

test('Emit', async () => {
  const wrapper = mount(SelectBranch)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})