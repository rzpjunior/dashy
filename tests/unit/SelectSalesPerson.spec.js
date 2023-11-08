import { mount } from '@vue/test-utils'
import SelectSalesPerson from '@/components/com/SelectSalesPerson.vue'

test('Props sales_person', async () => {
  const wrapper = mount(SelectSalesPerson)
  await wrapper.setProps({ sales_person: '65536' })
  expect(wrapper.props('sales_person')).toBe('65536')
})

test('Props sales_person', async () => {
  const wrapper = mount(SelectSalesPerson)
  await wrapper.setProps({ sales_person: null })
  expect(wrapper.props('sales_person')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectSalesPerson)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Emit', async () => {
  const wrapper = mount(SelectSalesPerson)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})