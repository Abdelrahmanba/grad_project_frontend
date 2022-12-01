import { Column } from '@ant-design/plots'
import { DatePicker, Space } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function BirthStat({ ids }) {
  const [data, setData] = useState([])
  const [year, setYear] = useState('2022')
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async (ids, year = '2022') => {
    setLaoding(true)
    let data = []
    for (const id of ids) {
      const res = await get(
        `/stats/kindergartens/semester/${id}/children/grouping/birth?year=${year}`,
        token
      )

      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.month != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.month]) {
        res[value.month] = { month: value.month, count: 0 }
        result.push(res[value.month])
      }
      res[value.month].count += value.count
      return res
    }, {})
    setData(result.sort((a, b) => (a.month > b.month ? 1 : b.month > a.month ? -1 : 0)))
    setLaoding(false)
  }
  useEffect(() => {
    fetchState(ids, year)
  }, [ids, year])

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
