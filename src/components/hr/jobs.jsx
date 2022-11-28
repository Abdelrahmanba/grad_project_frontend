import { Descriptions, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { get } from '../../utils/apiCall'

export default function Jobs() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { kid } = useParams()

  const fetchAllJobs = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(`/jobs/kindergarten/${kid}?pageNumber=1&pageSize=1`, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
      setJobs(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllJobs()
  }, [])

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'childStatusId',
      render: (tag) => {
        let color
        if (tag === 1) {
          color = 'volcano'
        }
        if (tag === 2) {
          color = 'geekblue'
        }
        if (tag === 3) {
          color = 'green'
        }
        return (
          <span>
            <Tag color={color} key={tag}>
              {tag === 1 && 'Looking For Kindergarten'}
              {tag === 2 && 'Enrolled'}
              {tag === 3 && 'Graduated'}
            </Tag>
          </span>
        )
      },
    },

    {
      title: 'Kindergarten',
      dataIndex: 'kindergarten',
      key: 'kindergarten',
      render: (k) => {
        if (k === null) {
          return 'N/A'
        } else {
          return k.name
        }
      },
    },
    {
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>Remove</a>,
    },
  ]
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Jobs</h2>
      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchAllJobs(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={jobs}
      />
    </div>
  )
}