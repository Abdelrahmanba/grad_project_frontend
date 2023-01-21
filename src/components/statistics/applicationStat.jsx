import { Pie } from '@ant-design/charts'
import { DatePicker, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../utils/apiCall'
import moment from 'moment'

export default function ApplicationStat() {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)
  const [year1, setYear1] = useState("2023-1-3")
  const [year2, setYear2] = useState("2023-2-3")


  const [loading, setLaoding] = useState(true)
  const stat = {
    1: 'Under Review',
    2: 'Approved',
    3: 'Confirmed',
    4: 'Rejected',
  }
  const fetchState = async () => {
    const res = await get(
      `/stats/registerapplications/grouping/applicationStatus?startDate=${year1}&endDate=${year2}`,
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
  }, [year1,year2])

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
  const onChange1 = (date, dateString) => {
    console.log(dateString)
    setYear1(dateString)
  }
  const onChange2 = (date, dateString) => {
    setYear2(dateString)
  }
  return (
    <>
      <h1>Application Distrobution by status</h1>
      <Space>
        <h2>Start Date</h2>
        <DatePicker
          size='large'
          onChange={onChange1}
          picker='day'
          defaultValue={moment()}
          format='YYYY-MM-DD'
        />
        <h2>End Date</h2>
        <DatePicker
          size='large'
          onChange={onChange2}
          picker='day'
          defaultValue={moment()}
          format='YYYY-MM-DD'
        />
      </Space>
      <Pie loading={loading} {...config} />
    </>
  )
}
