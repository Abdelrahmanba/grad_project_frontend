import { Column } from '@ant-design/plots'
import { DatePicker, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'
import moment from 'moment'

export default function NewJoiners() {
  const [data, setData] = useState([])
  const [year, setYear] = useState('2022')
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async (year = '2022') => {
    setLaoding(true)
    const res = await get(`/stats/children/count/birth?year=${year}`, token)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.map(({ month, count, role_name }) => ({
        count,
        month,
      }))
      setData(data.sort((a, b) => (a.month > b.month ? 1 : b.month > a.month ? -1 : 0)))
    }
    setLaoding(false)
  }
  useEffect(() => {
    fetchState(year)
  }, [year])

  const onChange = (date, dateString) => {
    setYear(dateString)
  }
  const config = {
    data,
    xField: 'month',
    yField: 'count',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle'
    },
  }
  return (
    <>
      <Space>
        <h2>Select Year</h2>
        <DatePicker
          size='large'
          onChange={onChange}
          picker='year'
          defaultValue={moment()}
          format='YYYY'
        />
      </Space>
      <Column loading={loading} {...config} />
    </>
  )
}
