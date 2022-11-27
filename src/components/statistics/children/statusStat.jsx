import { Rose } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function StatusStat() {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)
  const [loading, setloading] = useState(true)
  const fetchState = async () => {
    setloading(true)
    const res = await get('/stats/children/grouping/childStatus?includeGender=true', token)
    if (res.ok) {
      const resJson = await res.json()
      setData(resJson)
    }
    setloading(false)
  }
  useEffect(() => {
    fetchState()
  }, [])

  const config = {
    data,
    isStack: true,
    xField: 'status_name',
    yField: 'count',
    seriesField: 'gender',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle'
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  }
  return <Rose loading={loading} {...config} />
}
