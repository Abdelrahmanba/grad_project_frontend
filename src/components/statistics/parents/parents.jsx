import React, { useState } from 'react'
import { Tabs } from 'antd'

import SemsterTransfer from '../../semsterTransfer/semsterTransfer'
import CitiesStat from './citiesStat'
import CountriesStat from './countriesStat'
import NoOfCStat from './noOfCStat'

export default function ParentsS() {
  const [ids, setIds] = useState([])
  const onSemestersUpdate = async (ids) => {
    setIds(ids)
  }
  return (
    <>
      <h1>Parents Statistics</h1>
      <SemsterTransfer onUpdate={onSemestersUpdate} />
      <Tabs
        defaultActiveKey='1'
        centered
        items={[
          {
            label: `Parents Cities Distrubution`,
            key: '1',
            children: <CitiesStat ids={ids} />,
          },
          {
            label: `Parents Countries Distrubution`,
            key: '2',
            style: { height: '80vh' },
            children: <CountriesStat ids={ids} />,
          },
          {
            label: `Siblings Count Distrubution`,
            key: '3',
            children: <NoOfCStat ids={ids} />,
          },
        ]}
      />
    </>
  )
}
