import { Pie } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function GenderStat({ ids }) {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)
  const [loading, setLaoding] = useState(true)

  const fetchState = async () => {
    setLaoding(true)
    let data = []
    for (const id of ids) {
      const res = await get(`/stats/kindergartens/semester/${id}/children/grouping/gender`, token)
      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.gender != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.gender]) {
        res[value.gender] = { gender: value.gender, count: 0 }
        result.push(res[value.gender])
      }
      res[value.gender].count += value.count
      return res
    }, {})
    setData(result)
    setLaoding(false)
  }
  useEffect(() => {
    fetchState(ids)
  }, [ids])

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
  return <Pie loading={loading} {...config} />
}
