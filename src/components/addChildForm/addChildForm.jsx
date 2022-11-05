import { DatePicker, Form, Input, message, Modal, Radio } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { post } from '../../utils/apiCall'

const AddChildForm = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)

  return (
    <Modal
      open={open}
      title='Register A New Child'
      okText='Add Child'
      cancelText='Cancel'
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={async () => {
        setLoading(true)
        const values = await form.validateFields()
        const res = await post('/children', token, values)
        if (res.ok) {
          message.success('New Child Added Successfully')
          const resJson = await res.json()
          onCreate(resJson)
          form.resetFields()
        } else {
          message.error('Something Went Wrong')
        }

        setLoading(false)
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name='firstName'
          label='First Name'
          rules={[
            {
              required: true,
              message: 'Please input the first name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='middleName'
          label='Middle Name'
          rules={[
            {
              required: true,
              message: 'Please input themiddle name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='lastName'
          label='Last Name'
          rules={[
            {
              required: true,
              message: 'Please input the last name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Date of birth'
          name='dateOfBirth'
          rules={[
            {
              required: true,
              message: 'Please input your child Birth Date!',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name='gender'
          label={'Gender'}
          rules={[
            {
              required: true,
              message: 'Please input your child gender!',
            },
          ]}
        >
          <Radio.Group>
            <Radio value='male'>Male</Radio>
            <Radio value='female'>Female</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddChildForm
