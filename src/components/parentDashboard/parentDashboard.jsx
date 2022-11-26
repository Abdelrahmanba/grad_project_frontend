import { Card, Modal, Skeleton } from 'antd'
import React, { useState } from 'react'

import AddButton from '../addButton/addButton'
import Section from '../section/section'
import ChildrenCards from '../childrenCards/childrenCards'
import StateCard from '../stateCard.jsx/stateCard'

export default function ParentDashboard() {
  const [newChild, setnewChild] = useState({})
  const onFinish = (val) => {
    setnewChild(val)
  }

  return (
    <>

      <Section title={'Current Children'}>
        <ChildrenCards newChild={newChild}>
          <AddButton title={'Add A New Child'} type={'child'} onFinish={onFinish} />
        </ChildrenCards>
      </Section>
    </>
  )
}
