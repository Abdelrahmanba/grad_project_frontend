import './registerK.scss'

import React, { useState } from 'react'
import { Layout, Steps } from 'antd'
import Step2 from './step2'
import { useSelector } from 'react-redux'
import Step1 from '../../components/registration/step1'
import { useHistory } from 'react-router-dom'

const { Content } = Layout
const { Step } = Steps

export default function RegisterK() {
  const [current, setCurrent] = useState(0)
  const history = useHistory()
  return (
    <Layout className="layout">
      <Content className="content">
        <h2>Register your Kindergarten</h2>
        <Steps type="navigation" current={current} className="steps">
          <Step title="Step 1" description="Create Your Account " />
          <Step title="Step 2" description="Register A Kindergarten" />
        </Steps>
        {current === 0 && (
          <Step1 onFinish={() => setCurrent(1)} isKindergartenOwner={true} />
        )}
        {current === 1 && <Step2 onFinish={() => history.push('/dashboard')} />}
      </Content>
    </Layout>
  )
}
