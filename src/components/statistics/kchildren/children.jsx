import React, { useState } from 'react'
import { Tabs } from 'antd'

import SemsterTransfer from '../../semsterTransfer/semsterTransfer'

import GenderStat from './genderStat'
import BirthStat from './birthStat'

export default function ChildrenS() {
  const [ids, setIds] = useState([])
  const onSemestersUpdate = async (ids) => {
    setIds(ids)
  }
  return (
    <>
      <h1>Children Statistics</h1>
      <SemsterTransfer onUpdate={onSemestersUpdate} />
      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: `Children gender Distrubution`,
            key: '1',
            children: <GenderStat ids={ids} />,
          },
          {
            label: `Children birth year Distrubution`,
            key: '2',
            children: <BirthStat ids={ids} />,
          },
        ]}
      />
    </>
  )
}
