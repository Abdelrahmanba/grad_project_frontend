import { Rose, Column } from '@ant-design/plots'
import { Segmented } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function CityStat() {
  const [data, setData] = useState([])
  const [diagram, setDiagram] = useState('Rose Diagram')
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    const res = await get('/stats/users/grouping/city', token)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.map(({ city, count }) => ({ value: count, type: city }))
      setData(data)
    }
    setLaoding(false)
  }
  useEffect(() => {
    fetchState()
  }, [])

  const barConfig = {
    data,
    xField: 'type',
    yField: 'value',
    loading: loading,

    legend: true,
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
  }
  const config = {
    data,
    loading: loading,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.9,
    legend: {
      position: 'bottom',
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
      {diagram == 'Rose Diagram' && <Rose {...config} />}
      {diagram == 'Bar Diagram' && <Column {...barConfig} />}
    </>
  )
}
