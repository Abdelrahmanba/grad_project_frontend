import React, { useState } from 'react'

import { DashboardOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import AllChildren from '../manager/allchildren'
import AllKindergartens from '../manager/allKindergartens'
import Allusers from '../manager/allusers'
import ApplicationStat from '../statistics/applicationStat'
import ChildrenS from '../statistics/children/children'
import KindergartensS from '../statistics/kindergartens/kindergartens'
import User from '../statistics/users/user'
import PlansAdmin from '../plansAdmin/plansAdmin'
const { Sider, Content } = Layout

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
    }, {
      label: 'Services',
      key: 'services',
      icon: <DashboardOutlined />,
      children: [
        {
          label: 'HR Service', key: 'hr', children:
            [
              { label: 'Plans', key: 'plans' },

            ],
        },],
    },
    {
      label: 'Statistics',
      key: 'statistics',
      icon: <DashboardOutlined />,
      children: [
        { label: 'Users', key: 'usersS' },
        { label: 'Children', key: 'childrenS' },
        { label: 'Kindergartens', key: 'kindergartensS' },
        { label: 'Applications', key: 'applicationS' },
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
          {current === 'applicationS' && <ApplicationStat />}
          {current === 'plans' && <PlansAdmin />}

        </Content>
      </Layout>
    </>
  )
}
