import { Column } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../../utils/apiCall'

export default function NoOfCStat({ ids }) {
  const [data, setData] = useState([])
  const token = useSelector((state) => state.user.token)
  const [loading, setloading] = useState(true)

  const fetchState = async () => {
    setloading(true)
    let data = []
    for (const id of ids) {
      const res = await get(
        `/stats/kindergartens/semester/${id}/parents/frequency/numberOfChildren`,
        token
      )
      if (res.ok) {
        const resJson = await res.json()
        const re = resJson.filter((value) => value.NumberOfChildrenForSameParent != null)
        data = [...data, ...re]
      }
    }
    let result = []
    data.reduce(function (res, value) {
      if (!res[value.NumberOfChildrenForSameParent]) {
        res[value.NumberOfChildrenForSameParent] = {
          NumberOfChildrenForSameParent: value.NumberOfChildrenForSameParent,
          frequency: 0,
        }
        result.push(res[value.NumberOfChildrenForSameParent])
      }
      res[value.NumberOfChildrenForSameParent].frequency += value.frequency
      return res
    }, {})
    setData(result)
    setloading(false)
  }
  useEffect(() => {
    fetchState(ids)
  }, [ids])

  const config = {
    data,
    xField: 'NumberOfChildrenForSameParent',
    yField: 'frequency',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle'
    },
  }
  return <Column loading={loading} {...config} />
}
