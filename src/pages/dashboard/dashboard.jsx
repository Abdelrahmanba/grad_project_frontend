import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './dashboard.scss'
import { useState } from 'react'
import ParentDashboard from '../../components/parentDashboard/parentDashboard'

export default function Dashboard() {
  const history = useHistory()

  const user = useSelector((state) => state.user.user)

  return (
    <Layout className='layout'>
      <Content className='content'>
        <h1>Welcome {user.firstName}.</h1>
        {user.roleId === 1 && <ParentDashboard />}
      </Content>
    </Layout>
  )
}
