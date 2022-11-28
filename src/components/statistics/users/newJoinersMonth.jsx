import { Line } from '@ant-design/plots'
import { DatePicker, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'
import moment from 'moment'

export default function NewJoinersMonth() {
  const [data, setData] = useState([])
  const [year, setYear] = useState('2022')
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async (year = [2022, 10]) => {
    setLaoding(true)
    const res = await get(
      `/stats/users/creation?year=${year[0]}&month=${year[1] + 1}&includeRoles=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson
        .map(({ day, count, role_name }) => ({
          count,
          day,
          role_name,
        }))
        .sort((a, b) => (a.day > b.day ? 1 : b.day > a.day ? -1 : 0))
      setData(data)
    }
    setLaoding(false)
  }
  useEffect(() => {
    fetchState(year)
  }, [year])

  const onChange = (date, dateString) => {
    setYear(date.toArray())
  }
  const config = {
    data,
    xField: 'day',
    yField: 'count',
    seriesField: 'role_name',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  }

  return (
    <>
      <Space>
        <h2>Select Month</h2>
        <DatePicker
          size='large'
          onChange={onChange}
          picker='month'
          defaultValue={moment()}
          format='YYYY-MM'
        />
      </Space>
      <Line loading={loading} {...config} />
    </>
  )
}
