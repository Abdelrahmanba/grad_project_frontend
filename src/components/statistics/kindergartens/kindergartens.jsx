import React from 'react'
import { Tabs } from 'antd'
import CountryStat from './countryStat'
import CityStat from './cityStat'
import NewJoiners from './newJoinersYear'
import NewJoinersMonth from './newJoinersMonth'

export default function KindergartensS() {
  return (
    <>
      <h1>Kindergartens Statistics</h1>
      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: `Country Distrubition`,
            key: '1',
            style: { height: '80vh' },
            children: <CountryStat />,
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
