import { Button, Descriptions, Spin, Table, Tag } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import Search from 'antd/lib/input/Search'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { get, patchCall } from '../../utils/apiCall'

export default function AllApplications() {
  const { kid } = useParams()
  const [kindergarten, setKindergarten] = useState({})
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [semster, setSemster] = useState(undefined)

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
      return []
    }
  }
  const fetchSemster = async (id) => {
    const res = await get(`/semesters/${id}?includeKindergarten=false`, token)
    if (res.ok) {
      const resJson = await res.json()
      setSemster(resJson)
    } else {
      return {}
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
  const fetchAllA = async (page = 1, rs,value = '') => {
    setPage(page)
    const res = await get(
      `/RegisterApplication/semester/${rs}?pageNumber=${page}&pageSize=10&includeChild=true&includeParent=True&includeKindergarten=false&searchQuery=${value}`,
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
  }

  const fetchKindergarten = async () => {
    setLoading(true)
    const res = await get(`/kindergartens/${kid}?includeRunningSemester=true`, token)
    if (res.ok) {
      const resJson = await res.json()
      setKindergarten(resJson)
      if (resJson.runningSemester != null) {
        await fetchSemster(resJson.runningSemester.id)
        await fetchAllA(1, resJson.runningSemester.id)
        setLoading(false)
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchKindergarten()
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
      render: (record) => {
        return (
          <ButtonGroup>
            {record.ApplicationStatus == 1 && (
              <Button type='primary' onClick={() => updateApp(record.id, 2)}>
                Accept
              </Button>
            )}
            {record.ApplicationStatus == 2 && (
              <Button type='primary' onClick={() => updateApp(record.id, 3)}>
                Confirm
              </Button>
            )}
            {record.ApplicationStatus !== 4 && (
              <Button type='ghost' onClick={() => updateApp(record.id, 4)}>
                Reject
              </Button>
            )}
          </ButtonGroup>
        )
      },
    },
  ]

  const updateApp = async (id, status) => {
    setLoading(true)
    console.log(id)

    const res = await patchCall('/RegisterApplication/' + id, token, {
      applicationStatus: status,
    })
    await fetchAllA(page, kindergarten.runningSemester.id)
    setLoading(false)
  }
  const onSearch = async (value) => {
    console.log(value)
    await fetchAllA(page, kindergarten.runningSemester.id,value)
  }
  if (loading) {
    return <Spin />
  } else {
    return (
      <div>
        {semster === undefined ? (
          <h2 style={{ marginTop: 0 }}>Applications </h2>
        ) : (
          <h2 style={{ marginTop: 0 }}>Applications for {semster.name} Semester </h2>
        )}

        {semster === undefined ? (
          <h2>Sorry, you dont have any active semsters, please add a semster first</h2>
        ) : (
          <>
           <Search
          placeholder='input search text'
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
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
          </>
        )}
      </div>
    )
  }
}
