import React, { useState } from 'react'

import { Layout, Menu } from 'antd'
import { DashboardOutlined, MailOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import Allusers from '../manager/allusers'
import AllChildren from '../manager/allchildren'
import AllKindergartens from '../manager/allKindergartens'
const { Sider, Header, Content, Footer } = Layout

export default function ManagerDashboard() {
  const [current, setCurrent] = useState('allUsers')

  const items = [
    {
      label: 'Users',
      icon: <UserOutlined />,
      key: 'users',
      children: [
        { label: 'All Users', key: 'allUsers' },
        { label: 'Parents', key: 'parents' },
        { label: 'Kindergarten Owners', key: 'kindergartensOwner' },
      ],
    },
    {
      label: 'Kindergartens',
      key: 'kindergartens',
      children: [{ label: 'Overview', key: 'koverview' }],
    },
    {
      label: 'Children',
      icon: <TeamOutlined />,
      key: 'children',
    },

    {
      label: 'Statistics',
      key: 'statistics',
      icon: <DashboardOutlined />,
      children: [{ label: 'Overview', key: 'overview' }],
    },
  ]
  return (
    <>
      <Sider width={200} theme='light'>
        <Menu
          mode='inline'
          defaultOpenKeys={['users', 'kindergartens', 'statistics']}
          style={{ minHeight: '70vh', borderRight: 0 }}
          items={items}
          selectedKeys={[current]}
          onSelect={(e) => setCurrent(e.key)}
          theme='light'
        />
      </Sider>
      <Layout className='layout'>
        <Content className='content'>
          {current === 'allUsers' && <Allusers />}
          {current === 'children' && <AllChildren />}
          {current === 'koverview' && <AllKindergartens />}
        </Content>
      </Layout>
    </>
  )
}
