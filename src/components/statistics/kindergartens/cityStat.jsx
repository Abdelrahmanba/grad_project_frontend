import { Pie, Column } from '@ant-design/plots'
import { Segmented } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function CityStat() {
  const [data, setData] = useState([])
  const [diagram, setDiagram] = useState('Rose Diagram')

  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    const res = await get('/stats/kindergartens/grouping/city', token)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.map(({ city, count }) => ({ value: count, type: city }))
      setData(data)
    }
  }
  useEffect(() => {
    fetchState()
  }, [])

  const barConfig = {
    data,
    xField: 'type',
    yField: 'value',

    legend: true,
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
  }
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  }
  return (
    <>
      <Segmented
        block
        options={['Rose Diagram', 'Bar Diagram']}
        onChange={(e) => setDiagram(e)}
        style={{ marginBottom: '70px' }}
      />
      {diagram == 'Rose Diagram' && <Pie {...config} />}
      {diagram == 'Bar Diagram' && <Column {...barConfig} />}
    </>
  )
}
