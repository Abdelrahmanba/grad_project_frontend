import React, { useState } from 'react'
import { DashboardOutlined, MailOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import AllApplications from '../../components/owner/allApplications'
import KAllChildren from '../../components/kAllChildren.jsx/kAllChildren'
import AllServices from '../../components/allServices/allServices'
import Support from '../../components/support/support'
const { Sider, Content } = Layout

export default function KindergartenControl() {
  const [current, setCurrent] = useState('dashboard')
  const { id: kid } = useParams()

  const items = [
    {
      label: 'Dashboard',
      icon: <UserOutlined />,
      key: 'dashboard',
    },

    {
      label: 'Applications',
      icon: <UserOutlined />,
      key: 'applications',
    },
    {
      label: 'Services',
      key: 'services',
      children: [
        { label: 'All Services', key: 'allServices' },
        { label: 'Active Subscribtions', key: 'subs' },
      ],
    },
    {
      label: 'Children',
      icon: <TeamOutlined />,
      key: 'children',
    },
    {
      label: 'Children Support',
      icon: <MailOutlined />,
      key: 'support',
    },
    {
      label: 'Statistics',
      key: 'statistics',
      icon: <DashboardOutlined />,
      children: [{ label: 'Overview', key: 'overview' }],
    },
  ]
  return (
    <Layout className='layout'>
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
      <Content className='content'>
        {current === 'applications' && <AllApplications />}
        {current === 'children' && <KAllChildren />}
        {current === 'allServices' && <AllServices />}
        {current === 'support' && <Support />}
      </Content>
    </Layout>
  )
}
