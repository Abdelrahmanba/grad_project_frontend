import { Pie } from '@ant-design/plots'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function CitiesStat({ ids }) {
  const [data, setData] = useState([])
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    setLaoding(true)
    let data = []
    for (const id of ids) {
      const res = await get(`/stats/kindergartens/semester/${id}/parents/grouping/city`, token)
      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.city != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.city]) {
        res[value.city] = { city: value.city, count: 0 }
        result.push(res[value.city])
      }
      res[value.city].count += value.count
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
    colorField: 'city',
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
    <>
      <Pie loading={loading} {...config} />
    </>
  )
}
