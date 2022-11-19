import { Breadcrumb, Col, Layout, Row, Spin, Typography } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setUser } from '../../redux/userSlice'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { patchCall } from '../../utils/apiCall'
import { useState } from 'react'
const { Content } = Layout

export default function Settings() {
  const user = useSelector((state) => state.user)
  const [loading, setloading] = useState(false)
  const dispatch = useDispatch()
  const data = ['firstName', 'lastName', 'email', 'dateOfBirth', 'phone']
  const onChange = []
  data.map(
    (item) =>
      (onChange[item] = async (value) => {
        setloading(true)
        const res = await patchCall('/users/me', user.token, { [item]: value })
        if (res.ok) {
          const resJson = await res.json()
          dispatch(setUser(resJson))
        }
        setloading(false)
      })
  )

  return (
    <Layout className='layout'>
      <Content className='content'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined />
            <span>Profile</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Update Profile</Breadcrumb.Item>
        </Breadcrumb>
        <h1>Personal Information</h1>
        <Spin spinning={loading}>
          {data.map((item) => (
            <Row style={{ margin: 10 }} key={item}>
              <Col offset={4} span={3}>
                <h3 style={{ margin: '0 20px' }}>{item}:</h3>
              </Col>
              <Col>
                <Typography.Title
                  editable={{
                    onChange: onChange[item],
                  }}
                  level={4}
                  style={{
                    margin: 0,
                  }}
                >
                  {user.user[item]}
                </Typography.Title>
              </Col>
            </Row>
          ))}
        </Spin>
      </Content>
    </Layout>
  )
}
