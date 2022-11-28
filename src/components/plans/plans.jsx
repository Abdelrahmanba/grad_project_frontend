import { Button, Card, Layout, message, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get, post } from '../../utils/apiCall'
import {
  BarChartOutlined,
  SwapRightOutlined,
  LineChartOutlined,
  DotChartOutlined,
  RightSquareOutlined,
} from '@ant-design/icons'
import './plans.scss'
import landing from '../../pages/landing/landing'
export default function Plans({ kindergartenId }) {
  const [plans, setPlans] = useState([])
  const [loading, setLaoding] = useState(true)
  const token = useSelector((state) => state.user.token)
  const fetchPlans = async () => {
    const res = await get('/plans/services/1', token)
    if (res.ok) {
      const plans = await res.json()
      setPlans(plans)
    }
    setLaoding(false)
  }

  const subscribe = async (planId) => {
    const res = await post('/subscriptions', token, { planId, kindergartenId })
    if (res.ok) {
      message.success('Subscribed Successfully')
    }
  }
  useEffect(() => {
    fetchPlans()
  }, [])
  const logos = [
    <BarChartOutlined
      style={{
        color: '#d2001a',
        fontSize: 56,
        margin: '60px 20px',
        textShadow: '5px 5px',
      }}
    />,
    <LineChartOutlined
      style={{
        color: '#d2001a',
        fontSize: 56,
        margin: '60px 20px',
        textShadow: '5px 5px',
      }}
    />,
    <DotChartOutlined
      style={{
        color: '#d2001a',
        fontSize: 56,
        margin: '60px 20px',
        textShadow: '5px 5px',
      }}
    />,
  ]
  return (
    <Layout className='layout'>
      <h1>HR Managment System</h1>
      <h2 style={{ width: 550 }}>
        <RightSquareOutlined /> Manage your staffing requirements from an efficient and intelligent
        centralized system.
      </h2>
      <h3>
        Clock in & out with pin functionality, create staff rotas and easily manage staff leave.
      </h3>
      <Space wrap className='plans' style={{ width: '100%', justifyContent: 'center' }}>
        <li className='feature-card'>
          <h2>
            <SwapRightOutlined />
            Feature
          </h2>
          <p>Monitors activity to identify project roadblocks</p>
        </li>
        <li className='feature-card'>
          <h2>
            <SwapRightOutlined />
            Feature
          </h2>
          <p>Monitors activity to identify project roadblocks</p>
        </li>
        <li className='feature-card'>
          <h2>
            <SwapRightOutlined />
            Feature
          </h2>
          <p>Monitors activity to identify project roadblocks</p>
        </li>
        <li className='feature-card'>
          <h2>
            <SwapRightOutlined />
            Feature
          </h2>
          <p>Monitors activity to identify project roadblocks</p>
        </li>
      </Space>
      <Space
        direction='horizontal'
        className='plans'
        align='center'
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {loading && <Spin spinning={landing} />}

        <div className='container'>
          <div className='panel pricing-table'>
            {plans.map((e, i) => (
              <div key={i} className='pricing-plan'>
                {logos[i]}
                <h2 className='pricing-header'>{e.name}</h2>
                <ul className='pricing-features'>
                  <li className='pricing-features-item'>Full HR Management</li>
                  <li className='pricing-features-item'>24 Hours Support</li>
                </ul>
                <span className='pricing-price'>{e.price}$</span>
                <Button
                  onClick={() => subscribe(e.id)}
                  type={i == 1 ? 'primary' : 'default'}
                  style={{ marginTop: 30, width: 120, height: 50, border: 'red 1px solid' }}
                >
                  Register
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Space>
    </Layout>
  )
}
