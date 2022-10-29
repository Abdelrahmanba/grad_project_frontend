import { Button, Checkbox, Col, Form, Input, Layout, Row } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/userSlice'

export default function SignIn() {
  const dispatch = useDispatch()
  const onFinish = (values) => {
    console.log('Success:', values)
    dispatch(signIn({ authStatus: 1 }))
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout className='layout'>
      <Row>
        <Col
          xs={{
            span: 22,
            offset: 1,
          }}
          md={{
            span: 12,
            offset: 6,
          }}
        >
          <h1 className='text-center'>Sign In</h1>
          <h3 className='text-center'> Sign in to our adminstraion system</h3>
          <Form
            name='basic'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
            style={{ marginBottom: 80 }}
          >
            <Form.Item
              label='E-Mail'
              name='email'
              rules={[
                { required: true, message: 'Please input your E-Mail!' },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 4, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type='primary' htmlType='submit' style={{ width: 90, height: 40 }}>
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Layout>
  )
}
