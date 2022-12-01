import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Pie } from '@ant-design/plots'
import { get } from '../../../utils/apiCall'

import SemsterTransfer from '../../semsterTransfer/semsterTransfer'
import { Content } from 'antd/lib/layout/layout'

export default function RegAppS() {
  const [data, setData] = useState([])
  const [loading, setLaoding] = useState(true)
  const token = useSelector((state) => state.user.token)

  const onSemestersUpdate = async (ids) => {
    fetchState(ids)
  }

  const fetchState = async (ids) => {
    setLaoding(true)
    let data = []
    for (const id of ids) {
      const res = await get(
        `/stats/kindergartens/semester/${id}/registerapplications/grouping/status`,
        token
      )
      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.status_name != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.status_name]) {
        res[value.status_name] = { status_name: value.status_name, count: 0 }
        result.push(res[value.status_name])
      }
      res[value.status_name].count += value.count
      return res
    }, {})
    setData(result)
    setLaoding(false)
  }

  const config = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'status_name',
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
  return (
    <Content>
      <h1>Applications Statistics</h1>
      <SemsterTransfer onUpdate={onSemestersUpdate} />
      <Pie loading={loading} {...config} />
    </Content>
  )
}
