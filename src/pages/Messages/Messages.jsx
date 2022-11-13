import { Breadcrumb, Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'

export default function Messages() {
  return (
    <Layout className="layout">
      <Content className="content">
        <Breadcrumb>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined />
            <span>Parent</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Messages</Breadcrumb.Item>
        </Breadcrumb>
      </Content>
    </Layout>
  )
}
