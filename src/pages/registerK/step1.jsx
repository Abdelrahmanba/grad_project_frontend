import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd'
import React, { useState } from 'react'
import Map from '../../components/map/map'

const { Option } = Select

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
const Step1 = () => {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
  }

  const [autoCompleteResult, setAutoCompleteResult] = useState([])
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([])
    } else {
      setAutoCompleteResult(['.com', '.org', '.net', '.edu'].map((domain) => `${value}${domain}`))
    }
  }
  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }))
  return (
    <Form
      {...formItemLayout}
      form={form}
      name='register-kindergaren'
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name='kname'
        label='Kindergarten Name'
        tooltip='Your official kindergarent name'
        rules={[
          {
            required: true,
            message: 'Please input your kindergarent name',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='email'
        label='Contact E-mail'
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='password'
        label='Password'
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name='confirm'
        label='Confirm Password'
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'))
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name='owner name'
        label='Owner Name'
        tooltip='Your personal name'
        rules={[
          {
            required: true,
            message: 'Please input your name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='phone'
        label='Phone Number'
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name='website'
        label='Website'
        rules={[
          {
            required: true,
            message: 'Please input website!',
          },
        ]}
      >
        <AutoComplete options={websiteOptions} onChange={onWebsiteChange} placeholder='website'>
          <Input />
        </AutoComplete>
      </Form.Item>

      <Form.Item
        name='about'
        label='About'
        tooltip='Please tell us more about your kindergarten'
        rules={[
          {
            required: true,
            message: 'Please input this field',
          },
        ]}
      >
        <Input.TextArea showCount maxLength={500} />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Map />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type='primary' htmlType='submit'>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Step1
