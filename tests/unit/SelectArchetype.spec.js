import { mount } from '@vue/test-utils'
import SelectArchetype from '@/components/com/SelectArchetype.vue'

test('Props archetype', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ archetype: '65536' })
  expect(wrapper.props('archetype')).toBe('65536')
})

test('Props archetype null', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ archetype: null})
  expect(wrapper.props('archetype')).toBe(null)
})

test('Props clear', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Props business type id', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ business_type_id: '65536' })
  expect(wrapper.props('business_type_id')).toBe('65536')
})

test('Props business type id', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ business_type_id: null })
  expect(wrapper.props('business_type_id')).toBe(null)
})

test('Props customer group', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ customer_group: null })
  expect(wrapper.props('customer_group')).toBe(null)
})

test('Props aux data', async () => {
  const wrapper = mount(SelectArchetype)
  await wrapper.setProps({ aux_data: 1 })
  expect(wrapper.props('aux_data')).toBe(1)
})

test('Emit', async () => {
  const wrapper = mount(SelectArchetype)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})