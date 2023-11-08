import { mount } from '@vue/test-utils'
import SelectCustomerGroup from '@/components/com/SelectCustomerGroup.vue'

test('Emit', async () => {
  const wrapper = mount(SelectCustomerGroup)
  wrapper.vm.selected('emit')
  expect(wrapper.emitted().selected).toBeTruthy()
})