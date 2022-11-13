import { Breadcrumb, Col, Layout, Row, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setUser } from '../../redux/userSlice'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'

export default function Settings() {
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const data = ['firstName', 'lastName', 'email', 'dateOfBirth', 'phone']
  const onChange = (value) => {
    const u = { ...user }
    u.firstName = value
    dispatch(setUser(u))
  }

  return (
    <Layout className="layout">
      <Content className="content">
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

        {data.map((item) => (
          <Row style={{ margin: 10 }} key={item}>
            <Col offset={4} span={3}>
              <h3 style={{ margin: '0 20px' }}>{item}:</h3>
            </Col>
            <Col>
              <Typography.Title
                editable={{
                  onChange: onChange,
                }}
                level={4}
                style={{
                  margin: 0,
                }}
              >
                {user[item]}
              </Typography.Title>
            </Col>
          </Row>
        ))}
      </Content>
    </Layout>
  )
}
