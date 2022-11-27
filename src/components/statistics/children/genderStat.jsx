import { Pie } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function GenderStat() {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    const res = await get('/stats/children/grouping/gender', token)
    if (res.ok) {
      const resJson = await res.json()
      setData(resJson)
    }
  }
  useEffect(() => {
    fetchState()
  }, [])

  const config = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'gender',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  }
  return <Pie {...config} />
}
