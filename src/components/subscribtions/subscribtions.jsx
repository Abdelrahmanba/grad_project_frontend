import { Button, Descriptions, Divider, Popconfirm, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteCall, get } from '../../utils/apiCall'

export default function Allusesrs() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [active, setActive] = useState([])
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const { kid } = useParams()
  const [page, setPage] = useState(1)
  const fetchSub = async (page = 1, active) => {
    setLoading(true)
    setPage(page)
    let url
    if (active === true) {
      url = `/subscriptions/kindergartens/${kid}?includePlan=true&includeService=true&includeKindergarten=false&isActive=true&orderBy=end_time&orderType=desc`
    } else {
      url = `/subscriptions/kindergartens/${kid}?includePlan=true&includeService=true&includeKindergarten=false&isActive=false&orderBy=end_time&orderType=desc`
    }
    const res = await get(url, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
        plan: e.plan.name,
        service: e.plan.service.name,
      }))
      if (active === true) {
        setActive(parsed)
      } else {
        setAll(parsed)
      }
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchSub(1)
    fetchSub(1, true)
  }, [])

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: 'Start Date',
      dataIndex: 'startTime',
      key: 'startDate',
    },
    {
      title: 'End Date',
      key: 'endTime',
      dataIndex: 'endTime',
    },

    {
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => {
        return (
          <Popconfirm
            placement='left'
            title={'Are You Sure'}
            onConfirm={async () => {
              setLoadingDelete(true)
              await deleteCall('/users/' + record.id, token)
              await fetchSub(page, true)
              setLoadingDelete(false)
            }}
            okText='Yes'
            loading={loadingDelete}
            cancelText='No'
          >
            <Button type='link'>Delete</Button>
          </Popconfirm>
        )
      },
    },
  ]

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Active Subscribtions</h2>
      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchSub(page, true),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        columns={columns}
        dataSource={active}
      />
      <h2 style={{ marginTop: 0 }}>Subscribtions History</h2>
      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchSub(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        columns={columns}
        dataSource={all}
      />
    </div>
  )
}
