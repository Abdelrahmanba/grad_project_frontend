import React, { useState } from 'react'

import { Layout, Menu } from 'antd'
import { DashboardOutlined, MailOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import Allusers from '../manager/allusers'
import AllChildren from '../manager/allchildren'
import AllKindergartens from '../manager/allKindergartens'
import User from '../statistics/users/user'
import ChildrenS from '../statistics/children/children'
import KindergartensS from '../statistics/kindergartens/kindergartens'
const { Sider, Header, Content, Footer } = Layout

export default function ManagerDashboard() {
  const [current, setCurrent] = useState('allUsers')

  const items = [
    {
      label: 'Users',
      icon: <UserOutlined />,
      key: 'allUsers',
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
      children: [
        { label: 'Users', key: 'usersS' },
        { label: 'Children', key: 'childrenS' },
        { label: 'Kindergartens', key: 'kindergartensS' },
        { label: 'Applications', key: 'applicationsS' },
      ],
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
          {current === 'usersS' && <User />}
          {current === 'childrenS' && <ChildrenS />}
          {current === 'kindergartensS' && <KindergartensS />}
        </Content>
      </Layout>
    </>
  )
}
