import { Pie } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function RoleState() {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    const res = await get('/stats/users/grouping/role', token)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.map(({ role_name, count }) => ({ value: count, type: role_name }))
      setData(data)
    }
  }
  useEffect(() => {
    fetchState()
  }, [])

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
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
