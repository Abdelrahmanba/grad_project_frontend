import React, { useState } from 'react'

import AddButton from '../addButton/addButton'
import Section from '../section/section'
import KinderGartenCards from '../KindergartensCards/kinderGartenCards'

export default function OwnerDashboard() {
  const [newKindergarten, setNewKindergarten] = useState({})
  const onFinish = (val) => {
    setNewKindergarten(val)
  }

  return (
    <Section title={'Registered Kindergarten'}>
      <KinderGartenCards
        newKindergarten={newKindergarten}
        url="/kindergartens/me?includeImages=true"
      >
        <AddButton
          title={'Add A New Kindergarten'}
          type={'kindergarten'}
          onFinish={onFinish}
        />
      </KinderGartenCards>
    </Section>
  )
}
