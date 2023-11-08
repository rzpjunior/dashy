import { mount } from '@vue/test-utils'
import SelectDivision from '@/components/com/SelectDivision.vue'

test('Props division', async () => {
  const wrapper = mount(SelectDivision)
  await wrapper.setProps({ division: '65536' })
  expect(wrapper.props('division')).toBe('65536')
})

test('Props clear', async () => {
  const wrapper = mount(SelectDivision)
  await wrapper.setProps({ clear: true})
  expect(wrapper.props('clear')).toBe(true)
})

test('Emit', async () => {
  const wrapper = mount(SelectDivision)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})