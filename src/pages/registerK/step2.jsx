import { AutoComplete, Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Map from '../../components/map/map'
import { post } from '../../utils/apiCall'

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

const mapLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
}
const Step2 = (props) => {
  const [form] = Form.useForm()
  const token = useSelector((state) => state.user.token)

  const [position, setposition] = useState({})
  const onFinish = async (values) => {
     await post('/kindergartens', token, { ...values, ...position })
    props.onFinish()
  }

  const [autoCompleteResult, setAutoCompleteResult] = useState([])
  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([])
    } else {
      setAutoCompleteResult(
        ['.com', '.org', '.net', '.edu'].map((domain) => `${value}${domain}`)
      )
    }
  }

  const onChange = (val) => {
    setposition(val)
  }
  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }))
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register-kindergaren"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Kindergarten Name"
        tooltip="Your official kindergarent name"
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
        name="website"
        label="Website"
        rules={[
          {
            required: true,
            message: 'Please input website!',
          },
        ]}
      >
        <AutoComplete
          options={websiteOptions}
          onChange={onWebsiteChange}
          placeholder="website"
        >
          <Input />
        </AutoComplete>
      </Form.Item>

      <Form.Item
        name="about"
        label="About"
        tooltip="Please tell us more about your kindergarten"
        rules={[
          {
            required: true,
            message: 'Please input this field',
          },
        ]}
      >
        <Input.TextArea showCount maxLength={500} />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Map onChange={onChange} />
      </Form.Item>
      <Form.Item {...mapLayout}></Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Step2
