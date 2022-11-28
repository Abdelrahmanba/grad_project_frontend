import React from 'react'
import { Tabs } from 'antd'
import GenderStat from './genderStat'
import StatusStat from './statusStat'
import BirthStat from './birthStat'

export default function ChildrenS() {
  return (
    <>
      <h1>Users Statistics</h1>
      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: `Gender Distrubition`,
            key: '1',
            children: <GenderStat />,
          },
          {
            label: `Child Status Distrubition`,
            key: '2',
            children: <StatusStat />,
          },
          {
            label: `Children birth Month Distrobution`,
            key: '3',
            children: <BirthStat />,
          },
        ]}
      />
    </>
  )
}
