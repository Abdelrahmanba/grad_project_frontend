import React from 'react'
import { Tabs } from 'antd'
import RoleState from './roleStat'
import CityStat from './cityStat'
import NewJoiners from './newJoinersYear'
import NewJoinersMonth from './newJoinersMonth'

export default function User() {
  return (
    <>
      <h1>Users Statistics</h1>
      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: `Roles Distrubition`,
            key: '1',
            children: <RoleState />,
          },
          {
            label: `City Distrubition`,
            key: '2',
            children: <CityStat />,
          },
          {
            label: `New Joiners Percentage by Month`,
            key: '3',
            children: <NewJoiners />,
          },
          {
            label: `New Joiners Percentage by Day`,
            key: '4',
            children: <NewJoinersMonth />,
          },
        ]}
      />
    </>
  )
}
