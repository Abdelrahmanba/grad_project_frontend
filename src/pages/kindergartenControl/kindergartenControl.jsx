import React, { useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  DashboardOutlined,
  CommentOutlined,
  SolutionOutlined,
  FileTextOutlined,
  TagsOutlined,
  BookOutlined,
  ShopOutlined,
  LaptopOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  IdcardOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import AllApplications from '../../components/owner/allApplications'
import KAllChildren from '../../components/kAllChildren.jsx/kAllChildren'
import AllServices from '../../components/allServices/allServices'
import Support from '../../components/support/support'
import Plans from '../../components/plans/plans'
import { get } from '../../utils/apiCall'
import { useSelector } from 'react-redux'
import Subscribtions from '../../components/subscribtions/subscribtions'
import Jobs from '../../components/hr/jobs'
import Employees from '../../components/hr/employees'
import Bounses from '../../components/hr/bounses'
import { LockOutlined } from '@ant-design/icons'
import Semesters from '../../components/semesters/semesters'
const { Sider, Content } = Layout

export default function KindergartenControl() {
  const [current, setCurrent] = useState('dashboard')
  const { kid } = useParams()
  const [sub, setSub] = useState(0)

  const token = useSelector((state) => state.user.token)

  const fetchStatus = async () => {
    const res = await get(
      `/subscriptions/kindergartens/${kid}?includePlan=true&includeService=true&includeKindergarten=false&isActive=true&orderBy=end_time&orderType=desc`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      setSub(resJson.count)
    }
  }
  useEffect(() => {
    fetchStatus()
  }, [])

  const items = [
    {
      label: 'Dashboard',
      icon: <AppstoreOutlined />,
      key: 'dashboard',
    },

    {
      label: 'Applications',
      icon: <FileTextOutlined />,
      key: 'applications',
    },
    {
      label: 'Semesters',
      icon: <BookOutlined />,
      key: 'semesters',
    },
    {
      label: 'Services',
      key: 'services',
      icon: <SolutionOutlined />,
      children: [
        { label: 'All Services', key: 'allServices', icon: <TagsOutlined /> },

        { label: 'Subscriptions', key: 'subs', icon: <ShopOutlined /> },
        {
          label: 'HR Managament',
          disabled: !sub,
          key: 'hr',
          icon: !sub ? <LockOutlined /> : <IdcardOutlined />,
          children: [
            { label: 'Dashboard', key: 'hr-dash', icon: <AppstoreOutlined /> },
            { label: 'Jobs', key: 'jobs', icon: <LaptopOutlined /> },
            { label: 'Employees', key: 'employees', icon: <UsergroupAddOutlined /> },
            { label: 'Bounces', key: 'bounes', icon: <DollarOutlined /> },
          ],
        },
      ],
    },
    {
      label: 'Children',
      icon: <TeamOutlined />,
      key: 'children',
    },
    {
      label: 'Children Support',
      icon: <CommentOutlined />,
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
          defaultOpenKeys={['users', 'kindergartens', 'statistics', 'allServices']}
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
        {current === 'allServices' && (
          <AllServices sub={sub} kindergartenId={kid} onClick={() => setCurrent('hr-dash')} />
        )}
        {current === 'support' && <Support />}
        {current === 'hr-dash' && <Plans kindergartenId={kid} />}
        {current === 'subs' && <Subscribtions />}
        {current === 'jobs' && <Jobs />}
        {current === 'employees' && <Employees />}
        {current === 'bounes' && <Bounses />}
        {current === 'semesters' && <Semesters />}
      </Content>
    </Layout>
  )
}
