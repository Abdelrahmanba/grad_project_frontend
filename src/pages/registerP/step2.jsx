import { Button, DatePicker, Form, Input, message, Radio } from 'antd'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import { post } from '../../utils/apiCall'

export default function Step2(props) {
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const db = getFirestore()

  const history = useHistory()
  const onFinish = async (values) => {
    setLoading(true)
    const res = await post('/children', token, values)
    const resJson = await res.json()
    if (res.ok) {
      message.success('New Child Added Successfully')
      const resJson = await res.json()
      await setDoc(doc(db, 'children', resJson.id.toString()), { kindergartens: [] })
      history.push('/dashboard')
    } else {
      message.error(resJson.errors[0].message)
    }
    setLoading(false)
  }
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  }
  return (
    <Form {...formItemLayout} name='form_in_modal' onFinish={onFinish} scrollToFirstError>
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
      <Form.Item {...tailFormItemLayout}>
        <Button type='primary' htmlType='submit' style={{ width: 90 }} loading={loading}>
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}
