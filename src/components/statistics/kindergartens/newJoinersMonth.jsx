import { Area } from '@ant-design/plots'
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
      `/stats/kindergartens/creation?year=${year[0]}&month=${year[1] + 1}`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.sort((a, b) => (a.day > b.day ? 1 : b.day > a.day ? -1 : 0))
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
    padding: 'auto',
    xField: 'day',
    yField: 'count',
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
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
      <Area loading={loading} {...config} />
    </>
  )
}
