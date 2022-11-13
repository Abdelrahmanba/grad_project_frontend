import { Breadcrumb, Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { useSelector } from 'react-redux'
import './dashboard.scss'
import ParentDashboard from '../../components/parentDashboard/parentDashboard'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import OwnerDashboard from '../../components/OwnerDashboard/ownerDashboard'

export default function Dashboard() {
  const user = useSelector((state) => state.user.user)

  return (
    <Layout className="layout">
      <Content className="content">
        <Breadcrumb>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <UserOutlined />
            <span>
              {user.roleId === 1 && 'Parent'}
              {user.roleId === 2 && 'Owner'}
              {user.roleId === 3 && 'Manager'}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h1>Welcome {user.firstName}.</h1>
        {user.roleId === 1 && <ParentDashboard />}
        {user.roleId === 2 && <OwnerDashboard />}
      </Content>
    </Layout>
  )
}
