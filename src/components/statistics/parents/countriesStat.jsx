import { AreaMap } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function CountriesStat({ ids }) {
  const [data, setData] = useState([])
  const [loading, setLaoding] = useState(true)

  const token = useSelector((state) => state.user.token)

  const fetchState = async () => {
    setLaoding(true)
    let data = []
    for (const id of ids) {
      const res = await get(`/stats/kindergartens/semester/${id}/parents/grouping/country`, token)
      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.country != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.country]) {
        res[value.country] = { country: value.country, count: 0 }
        result.push(res[value.country])
      }
      res[value.country].count += value.count
      return res
    }, {})

    const mapp = await fetch(
      `https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json`
    )
    if (mapp.ok) {
      const resJson = await mapp.json()
      result.forEach((element) => {
        const index = resJson.features.findIndex((e) => e.properties.name === element.country)
        if (index === -1) {
          resJson.features[80].properties.count = resJson.features[80].properties.count
            ? (resJson.features[80].properties.count += element.count)
            : element.count
          resJson.features[175].properties.count = resJson.features[175].properties.count
            ? (resJson.features[175].properties.count += element.count)
            : element.count
        } else {
          resJson.features[index].properties.count = element.count
        }
      })
      resJson.features[80].properties.name = 'Palestine'
      setData(resJson)
      setLaoding(false)
    }
  }
  useEffect(() => {
    fetchState(ids)
  }, [ids])

  const config = {
    map: {
      type: 'mapbox',
      style: 'blank',

      center: [33.9522, 32.233],
      zoom: 3,
      pitch: 0,
    },
    source: {
      data: data,
      parser: {
        type: 'geojson',
      },
    },
    color: {
      field: 'count',
      value: [
        'rgb(239,243,255)',
        'rgb(189,215,231)',
        'rgb(107,174,214)',
        'rgb(49,130,189)',
        'rgb(8,81,156)',
      ],
      scale: {
        type: 'quantile',
      },
    },
    style: {
      opacity: 1,
      stroke: 'rgb(93,112,146)',
      lineWidth: 0.6,
      lineOpacity: 1,
    },
    state: {
      active: true,
    },
    label: {
      visible: true,
      field: 'name',
      style: {
        fill: '#000',
        opacity: 0.8,
        fontSize: 10,
        stroke: '#fff',
        strokeWidth: 1.5,
        textAllowOverlap: false,
        padding: [5, 5],
      },
    },
    tooltip: {
      items: ['name', 'count'],
    },
    zoom: {
      position: 'topright',
    },
    legend: {
      position: 'topleft',
    },
  }
  return (
    <>
      <AreaMap loading={loading} {...config} />
    </>
  )
}
