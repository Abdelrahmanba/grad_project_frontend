import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { patchCall, post, postFile } from '../../utils/apiCall'

const AddChildForm = ({ open, onCancel, onCreate, defaultValues, type }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const [image, setImage] = useState(null)
  const dummyReq = ({ data, file, onSuccess }) => {
    const formData = new FormData()
    formData.set('image', file)
    setImage(formData)
    setTimeout(() => onSuccess('ok'), 0)
  }

  const formComponent = (
    <Form
      form={form}
      layout="vertical"
      name="form_in_modal"
      initialValues={defaultValues}
    >
      <Form.Item
        name="firstName"
        label="First Name"
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
        name="middleName"
        label="Middle Name"
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
        name="lastName"
        label="Last Name"
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
        label="Date of birth"
        name="dateOfBirth"
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
        label="Photo"
        rules={[
          {
            required: true,
            message: 'Please input your child photo!',
          },
        ]}
      >
        <Upload maxCount={1} accept="image/*" customRequest={dummyReq}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="gender"
        label={'Gender'}
        rules={[
          {
            required: true,
            message: 'Please input your child gender!',
          },
        ]}
      >
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  )
  if (type === 'add') {
    return (
      <Modal
        open={open}
        title="Register A New Child"
        okText="Add Child"
        cancelText="Cancel"
        onCancel={onCancel}
        confirmLoading={loading}
        onOk={async () => {
          setLoading(true)
          const values = await form.validateFields()
          
          const res = await post('/children', token, values)
          if (res.ok) {
            message.success('New Child Added Successfully')
            const resJson = await res.json()
            const resImage = await postFile(
              '/files/image/child/' + resJson.id,
              token,
              image
            )
            if (resImage.ok) {
              const imgURL = await resImage.json()
              onCreate({ ...resJson, imgs: [imgURL.imgs] })
            }

            form.resetFields()
          } else {
            message.error('Something Went Wrong')
          }

          setLoading(false)
        }}
      >
        {formComponent}
      </Modal>
    )
  } else {
    return (
      <Modal
        open={open}
        title="Update Child Info"
        okText="Update Child"
        cancelText="Cancel"
        onCancel={onCancel}
        confirmLoading={loading}
        onOk={async () => {
          setLoading(true)
          const values = await form.validateFields()
          const res = await patchCall(
            '/children/' + defaultValues.id,
            token,
            values
          )
          if (res.ok) {
            message.success('Data Updated Successfully')
            const resJson = await res.json()
            if (image !== null) {
              const resImage = await postFile(
                '/files/image/child/' + resJson.id,
                token,
                image
              )
              if (resImage.ok) {
                const imgURL = await resImage.json()
              }
            } else {
              onCreate({ ...resJson })
            }

            form.resetFields()
          } else {
            message.error('Something Went Wrong')
          }

          setLoading(false)
        }}
      >
        {formComponent}
      </Modal>
    )
  }
}

export default AddChildForm
