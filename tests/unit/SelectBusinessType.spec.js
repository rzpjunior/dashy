import { mount } from '@vue/test-utils'
import SelectBusinessType from '@/components/com/SelectBusinessType.vue'

test('Props business_type', async () => {
  const wrapper = mount(SelectBusinessType)
  await wrapper.setProps({ business_type: '65536' })
  expect(wrapper.props('business_type')).toBe('65536')
})

test('Props business_type null', async () => {
  const wrapper = mount(SelectBusinessType)
  await wrapper.setProps({ business_type: null})
  expect(wrapper.props('business_type')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectBusinessType)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Props aux data', async () => {
  const wrapper = mount(SelectBusinessType)
  await wrapper.setProps({ aux_data: 1 })
  expect(wrapper.props('aux_data')).toBe(1)
})

test('Emit', async () => {
  const wrapper = mount(SelectBusinessType)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})