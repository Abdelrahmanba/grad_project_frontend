import './registerK.scss'

import React, { useState } from 'react'
import { Layout, Steps } from 'antd'
import Step1 from './step1'
import Step2 from './step2'
import { useSelector } from 'react-redux'

const { Content } = Layout
const { Step } = Steps

export default function RegisterK() {
  const [current, setCurrent] = useState(0)
  return (
    <Layout className='layout'>
      <Content className='content'>
        <h2>Register your Kindergarten</h2>
        <Steps type='navigation' current={current} className='steps'>
          <Step title='Step 1' description='Create Your Account ' />
          <Step title='Step 2' description='Register A Kindergarten' />
          <Step title='Step 3' />
          <Step title='Step 4' />
        </Steps>
        {current == 0 && <Step1 onFinish={() => setCurrent(1)} />}
        {current == 1 && <Step2 onFinish={() => setCurrent(2)} />}
      </Content>
    </Layout>
  )
}
