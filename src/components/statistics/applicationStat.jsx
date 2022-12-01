import { Pie } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../utils/apiCall'

export default function ApplicationStat() {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)
  const [loading, setLaoding] = useState(true)
  const stat = {
    1: 'Under Review',
    2: 'Approved',
    3: 'Confirmed',
    4: 'Rejected',
  }
  const fetchState = async () => {
    const res = await get(
      '/stats/registerapplications/grouping/applicationStatus?startDate=2021-10-01&endDate=2022-12-01',
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.map((e) => ({ ...e, application_status: stat[e.application_status] }))
      setData(parsed)
    }
    setLaoding(false)
  }
  useEffect(() => {
    fetchState()
  }, [])

  const config = {
    appendPadding: 10,
    data,
    angleField: 'count',
    colorField: 'application_status',

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
      <h1>Application Distrobution by status</h1>
      <Pie loading={loading} {...config} />
    </>
  )
}
