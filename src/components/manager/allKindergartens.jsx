import { Button, Descriptions, Divider, Popconfirm, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteCall, get } from '../../utils/apiCall'

export default function AllKindergartens() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [kindergartens, setKindergartens] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const fetchAllK = async (page = 1) => {
    setLoading(true)
    setPage(page)
    const res = await get(`/kindergartens?pageNumber=${page}&pageSize=10&includeImages=true`, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
      setKindergartens(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllK()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'locationFormatted',
      key: 'Contact Email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Country',
      key: 'country',
      dataIndex: 'country',
    },
  ]

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Registered Kindergartens</h2>

      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchAllK(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        columns={columns}
        dataSource={kindergartens}
      />
    </div>
  )
}
