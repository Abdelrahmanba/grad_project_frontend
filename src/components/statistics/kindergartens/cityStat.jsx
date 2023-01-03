import { Column, Pie } from '@ant-design/plots'
import { Segmented, Select } from 'antd'
import { options } from 'less'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function CityStat() {
  const [data, setData] = useState([])
  const [diagram, setDiagram] = useState('Rose Diagram')
  const [loading, setLaoding] = useState(true)
  const [options, setoptions] = useState([{ value: 'Palestine' }])

  const token = useSelector((state) => state.user.token)

  const fetchCountries = async () => {
    const countries = await get('/stats/kindergartens/grouping/country', token)
    if (countries.ok) {
      const resJ = await countries.json()
      const options = resJ.map((e) => ({ value: e.country, label: e.country }))
      setoptions(options)
    }
  }

  const fetchState = async (country = options[0].value) => {
    const res = await get('/stats/kindergartens/grouping/city?country=' + country, token)
    if (res.ok) {
      const resJson = await res.json()
      const data = resJson.map(({ city, count }) => ({ value: count, type: city }))
      setData(data)
    }
    setLaoding(false)
  }
  useEffect(() => {
    fetchState()
    fetchCountries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const barConfig = {
    data,
    xField: 'type',
    yField: 'value',

    legend: true,
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
      },
    },
  }
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  }
  return (
    <>
      <Segmented
        block
        options={['Rose Diagram', 'Bar Diagram']}
        onChange={(e) => setDiagram(e)}
        style={{ marginBottom: '70px' }}
      />
      <Select
        options={options}
        style={{ minWidth: 150 }}
        defaultValue={options[0].value}
        onSelect={(e) => fetchState(e)}
      />
      {diagram === 'Rose Diagram' && <Pie loading={loading} {...config} />}
      {diagram === 'Bar Diagram' && <Column loading={loading} {...barConfig} />}
    </>
  )
}
