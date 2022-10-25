import './registerK.scss'

import React, { useState } from 'react'
import { Layout, Steps } from 'antd'
import Step1 from './step1'
const { Content } = Layout
const { Step } = Steps

export default function RegisterK() {
  const [current, setCurrent] = useState(0)
  const onChange = (value) => {
    console.log('onChange:', value)
    setCurrent(value)
  }
  return (
    <Layout className='layout'>
      <Content className='content'>
        <h2>Register your Kindergarten</h2>
        <Steps type='navigation' current={current} onChange={onChange} className='steps'>
          <Step status='finish' title='Step 1' />
          <Step status='process' title='Step 2' />
          <Step status='wait' title='Step 3' />
          <Step status='wait' title='Step 4' />
        </Steps>
        {current == 0 && <Step1 />}
      </Content>
    </Layout>
  )
}
