import '../registerK/registerK.scss'

import React, { useState } from 'react'
import { Layout, Steps } from 'antd'
import Step1 from '../../components/registration/step1'
import Step2 from './step2'

const { Content } = Layout
const { Step } = Steps

export default function RegisterP() {
  const [current, setCurrent] = useState(0)
  return (
    <Layout className="layout">
      <Content className="content">
        <h2>Find Kindergarten for your child</h2>
        <Steps type="navigation" current={current} className="steps">
          <Step title="Step 1" description="Create Your Account " />
          <Step title="Step 2" description="Add Your Children" />
        </Steps>
        {current === 0 && (
          <Step1 onFinish={() => setCurrent(1)} isKindergartenOwner={false} />
        )}
        {current === 1 && <Step2 />}
      </Content>
    </Layout>
  )
}
