import { Button, Descriptions, Divider, Popconfirm, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteCall, get } from '../../utils/apiCall'

export default function Allusesrs() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const [page, setPage] = useState(1)
  const roles = { 1: 'Parent', 2: 'Owner', 3: 'Site Maneger' }
  const fetchAllUsers = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/users/All?pageNumber=${page}&pageSize=10&includeChildren=true&includeRole=false`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
      setUsers(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllUsers()
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
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      key: 'phobe',
      dataIndex: 'phone',
    },

    {
      title: 'Role',
      key: 'role',
      dataIndex: 'roleId',
      render: (r) => roles[r],
    },
    {
      title: 'Country',
      key: 'country',
      dataIndex: 'country',
    },
    {
      title: 'City',
      key: 'city',
      dataIndex: 'city',
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Children',
      key: 'children',
      dataIndex: 'children',
      render: (ch) => {
        if (ch) return ch.length
      },
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
              await fetchAllUsers(page)
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
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const bulkDelete = async () => {
    for (let i = 0; i < selectedRowKeys.length; i++) {
      await deleteCall('/users/' + selectedRowKeys[i], token)
    }
    await fetchAllUsers(1)
    setPage(1)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Website Users</h2>
      <Button
        onClick={bulkDelete}
        type='primary'
        style={{
          marginBottom: 16,
        }}
        disabled={!selectedRowKeys.length}
      >
        Delete Selected
      </Button>
      <Table
        bordered
        size='large'
        expandable={{
          childrenColumnName: 'none',
          rowExpandable: (record) => record.children.length !== 0,
          expandedRowRender: (record) =>
            record.children.map((child, index) => (
              <>
                <Descriptions
                  column={2}
                  title={
                    <Link to={'/child/' + child.id}>{child.firstName + ' ' + child.lastName}</Link>
                  }
                  key={index}
                >
                  <Descriptions.Item label='Status'>
                    <Tag color='red'>
                      {child.childStatusId === 1 && 'Looking For Kindergarten'}
                      {child.childStatusId === 2 && 'Enrolled'}
                      {child.childStatusId === 3 && 'Graduated'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Gender'>{child.gender}</Descriptions.Item>
                </Descriptions>
                {index !== record.children.length - 1 && <Divider />}
              </>
            )),
        }}
        pagination={{
          onChange: (page) => fetchAllUsers(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
      />
    </div>
  )
}
