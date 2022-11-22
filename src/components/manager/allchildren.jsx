import { Descriptions, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../utils/apiCall'

export default function AllChildren() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchAllChildren = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/children/all?pageNumber=${page}&pageSize=10&includeParent=true&includeChildStatus=true&includeKindergarten=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
        parent: e.user.firstName + ' ' + e.user.lastName,
      }))
      setChildren(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllChildren()
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
      <h2 style={{ marginTop: 0 }}>All Registered Children on the platform</h2>
      <Table
        bordered
        size='large'
        expandable={{
          expandedRowRender: (record) => (
            <Descriptions title='Parent Info'>
              <Descriptions.Item label='First Name'>{record.user.firstName}</Descriptions.Item>
              <Descriptions.Item label='Telephone'>1810000000</Descriptions.Item>
              <Descriptions.Item label='Live'>Hangzhou, Zhejiang</Descriptions.Item>
              <Descriptions.Item label='Remark'>empty</Descriptions.Item>
              <Descriptions.Item label='Address'>
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
        pagination={{
          onChange: (page) => fetchAllChildren(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={children}
      />
    </div>
  )
}
