import { Spin, Transfer } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/apiCall'

export default function SemsterTransfer({ onUpdate }) {
  const [targetKeys, setTargetKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [semsters, setSemsters] = useState([])
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.user.token)

  const { kid } = useParams()

  const fetchAllSemetsers = async () => {
    setLoading(true)
    const res = await get(`/semesters/kindergarten/${kid}?pageNumber=${1}&pageSize=10`, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
      if (parsed.length !== 0) {
        setTargetKeys([parsed[0].key])
        onUpdate([parsed[0].key])
      }
      setSemsters(parsed)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllSemetsers()
  }, [])

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys)
    onUpdate(nextTargetKeys)
  }
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  if (loading) {
    return <Spin />
  } else
    return (
      <div>
        <Transfer
          style={{ width: 900 }}
          listStyle={{ width: 450 }}
          dataSource={semsters}
          titles={[<h3>Semesters</h3>, <h3>Selected Semesters</h3>]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.name}
        />
      </div>
    )
}
