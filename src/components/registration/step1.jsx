import { Button, DatePicker, Form, Input, message, Select } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/userSlice'
import { post } from '../../utils/apiCall'
import countries from '../../utils/countries'

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

const Step1 = (props) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values) => {
    setLoading(true)
    const res = await post('/users', undefined, {
      ...values,
      isKindergartenOwner: props.isKindergartenOwner,
    })
    const resJson = await res.json(res)
    if (res.ok) {
      dispatch(signIn({ ...resJson, authStatus: resJson.user.roleId }))
      props.onFinish()
    } else {
      message.error(resJson.errors[0].message)
    }
    setLoading(false)
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register-kindergaren"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          {
            required: true,
            message: 'Please input your First Name',
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
            message: 'Please input your Last Name',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Contact E-mail"
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
        name="password"
        label="Password"
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
        name="confirm"
        label="Confirm Password"
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
              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              )
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Date of birth"
        name="dateOfBirth"
        rules={[
          {
            required: true,
            message: 'Please input your Birth Date!',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
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
        name="country"
        label="Country"
        initialValue={countries[167].value}
        rules={[
          {
            required: true,
            message: 'Please input your country!',
          },
        ]}
      >
        <Select options={countries} />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        rules={[
          {
            required: true,
            message: 'Please input your City!',
          },
        ]}
      >
        <Input
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: 90 }}
          loading={loading}
        >
          Next
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Step1
