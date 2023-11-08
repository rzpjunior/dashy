import { mount } from '@vue/test-utils'
import SelectArea from '@/components/com/SelectArea.vue'

test('Props', async () => {
  const wrapper = mount(SelectArea)
  await wrapper.setProps({ area: '65536' })
  expect(wrapper.props('area')).toBe('65536')
})

test('Props', async () => {
  const wrapper = mount(SelectArea)
  await wrapper.setProps({ area: null })
  expect(wrapper.props('area')).toBe(null)
})

test('Props', async () => {
  const wrapper = mount(SelectArea)
  await wrapper.setProps({ name: '' })
  expect(wrapper.props('name')).toBe('')
})

test('Props', async () => {
  const wrapper = mount(SelectArea)
  await wrapper.setProps({ clear: true })
  expect(wrapper.props('clear')).toBe(true)
})

test('Props', async () => {
  const wrapper = mount(SelectArea)
  await wrapper.setProps({ aux_data: 1 })
  expect(wrapper.props('aux_data')).toBe(1)
})

test('Emit', async () => {
  const wrapper = mount(SelectArea)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})