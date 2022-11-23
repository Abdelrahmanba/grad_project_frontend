import { Button, Descriptions, Divider, Popconfirm, Table, Tag } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { async } from 'q'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { deleteCall, get, patchCall } from '../../utils/apiCall'

export default function AllApplications() {
  const { kid } = useParams()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const appStatus = {
    1: 'Waiting for Your Review',
    2: 'APPROVED - Waiting for confirmation',
    3: 'CONFIRMED',
    4: 'REJECTED',
  }
  const [page, setPage] = useState(1)

  const fetchDocuments = async (id) => {
    const res = await get(`/files/document/RegisterApplication/${id}`, token)
    if (res.ok) {
      const resJson = await res.json()
      return resJson.documents
    } else {
      return undefined
    }
  }

  const fetchParent = async (id) => {
    const res = await get(`/children/${id}?includeParent=true`, token)
    if (res.ok) {
      const resJson = await res.json()
      return resJson.user
    } else {
      return undefined
    }
  }
  const fetchAllA = async (page = 1) => {
    setLoading(true)
    setPage(page)
    const res = await get(
      `/RegisterApplication/All/${kid}?pageNumber=${page}&pageSize=10&includeChild=true&includeParent=True&includeKindergarten=false`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = []
      for (const app of resJson.rows) {
        const parent = await fetchParent(app.childId)
        const docs = await fetchDocuments(app.id)
        parsed.push({ ...app, key: app.id, parent, docs })
      }

      setApplications(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllA()
  }, [])

  const columns = [
    {
      title: 'Child Name',
      key: 'cname',
      render: (record) => {
        return (
          <Link to={'/child/' + record.child.id}>
            {record.child.firstName + ' ' + record.child.lastName}
          </Link>
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'ApplicationStatus',
      key: 'ApplicationStatus',
      render: (tag) => {
        let color
        if (tag === 1) {
          color = 'volcano'
        }
        if (tag === 2) {
          color = 'green'
        }
        if (tag === 3) {
          color = 'geekblue'
        }

        if (tag === 4) {
          color = 'red'
        }
        return (
          <span>
            <Tag color={color} key={tag}>
              {appStatus[tag]}
            </Tag>
          </span>
        )
      },
    },
    {
      title: 'Gender',
      key: 'gender',
      render: (record) => {
        return record.child.gender
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (record) => {
        return new Date(record).toLocaleDateString()
      },
    },
    {
      title: 'Parent',
      key: 'parent',
      render: (record) => {
        return record.parent.firstName + ' ' + record.parent.lastName
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <ButtonGroup>
          {record.ApplicationStatus !== 2 && (
            <Button type='primary' onClick={() => updateApp(record.id, 2)}>
              Accept
            </Button>
          )}
          <Button type='ghost' onClick={() => updateApp(record.id, 4)}>
            Reject
          </Button>
        </ButtonGroup>
      ),
    },
  ]

  const updateApp = async (id, status) => {
    setLoading(true)
    const res = await patchCall('/RegisterApplication/' + id, token, {
      applicationStatus: status,
    })
    await fetchAllA(page)
    setLoading(false)
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Applications</h2>
      <Table
        bordered
        size='large'
        expandable={{
          expandedRowRender: (record) => (
            <Descriptions title='Extra Info'>
              <Descriptions.Item label='Telephone'> {record.parent.phone}</Descriptions.Item>
              <Descriptions.Item label='email'> {record.parent.email}</Descriptions.Item>
              <Descriptions.Item label='Docuemnts'>
                <ul>
                  {record.docs.map((doc, i) => (
                    <li key={i}>
                      <a href={process.env.REACT_APP_API_URL + doc}>Document {i + 1}</a>
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            </Descriptions>
          ),
        }}
        pagination={{
          onChange: (page) => fetchAllA(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        columns={columns}
        dataSource={applications}
      />
    </div>
  )
}
