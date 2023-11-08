import { mount } from '@vue/test-utils'
import SelectFilterBusinessType from '@/components/com/SelectFilterBusinessType.vue'

test('Props business_type', async () => {
  const wrapper = mount(SelectFilterBusinessType)
  await wrapper.setProps({ business_type: '65536' })
  expect(wrapper.props('business_type')).toBe('65536')
})

test('Props business type null', async () => {
  const wrapper = mount(SelectFilterBusinessType)
  await wrapper.setProps({ business_type: null })
  expect(wrapper.props('business_type')).toBe(null)
})

test('Props', async () => {
  const wrapper = mount(SelectFilterBusinessType)
  await wrapper.setProps({ clear: true })
  expect(wrapper.props('clear')).toBe(true)
})

test('Props', async () => {
  const wrapper = mount(SelectFilterBusinessType)
  await wrapper.setProps({ aux_data: 1 })
  expect(wrapper.props('aux_data')).toBe(1)
})

test('Emit', async () => {
  const wrapper = mount(SelectFilterBusinessType)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})