import { mount } from '@vue/test-utils'
import SelectWarehouseCoverage from '@/components/com/SelectWarehouseCoverage.vue'

test('Props warehouse', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ warehouse: '65536' })
  expect(wrapper.props('warehouse')).toBe('65536')
})

test('Props warehouse null', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ warehouse: null})
  expect(wrapper.props('warehouse')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Props subdistrict id', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ subdistrict_id: '65536' })
  expect(wrapper.props('subdistrict_id')).toBe('65536')
})

test('Props subdistrict id', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ subdistrict_id: null })
  expect(wrapper.props('subdistrict_id')).toBe(null)
})

test('Props aux data', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  await wrapper.setProps({ aux_data: 1 })
  expect(wrapper.props('aux_data')).toBe(1)
})

test('Emit', async () => {
  const wrapper = mount(SelectWarehouseCoverage)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})