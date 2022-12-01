import { Button, DatePicker, Col, Drawer, Form, Input, Row, Space, Table, Tag, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, post } from '../../utils/apiCall'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function Semesters({ onClick }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [semsters, setSemsters] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { kid } = useParams()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const showDrawer = () => {
    setOpen(true)
  }
  const onOk = async () => {
    const values = await form.validateFields()
    const res = await post(`/semesters`, token, {
      startDate: values.se[0].format('YYYY-MM-DD'),
      endDate: values.se[1].format('YYYY-MM-DD'),
      registrationExpiration: values.registrationExpiration.format('YYYY-MM-DD'),
      kindergartenId: kid,
      name: values.name,
      tuition: values.tuition,
    })
    if (res.ok) {
      fetchAllSemetsers()
    } else {
      const resJson = await res.json()
      message.error(resJson.msg)
    }
    form.resetFields()
    setOpen(false)
  }
  const onClose = async (e) => {
    setOpen(false)
  }
  const fetchAllSemetsers = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(`/semesters/kindergarten/${kid}?pageNumber=${page}&pageSize=10`, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
      setSemsters(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllSemetsers()
  }, [])

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (n) => (
        <Button type='link' onClick={() => onClick(n.id)}>
          {n.name}
        </Button>
      ),
    },
    {
      title: 'Tuition',
      dataIndex: 'tuition',
      key: 'tuition',
      render: (t) => t + '$',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Registration Expiration',
      dataIndex: 'registrationExpiration',
      key: 'registrationExpiration',
    },
    {
      title: 'Status',
      key: 'status',
      render: (sem) => {
        let color
        let status
        if (new Date(sem.endDate) < new Date()) {
          color = 'volcano'
          status = 'Expired'
        } else {
          color = 'green'
          status = 'Active'
        }
        return (
          <span>
            <Tag color={color}>{status}</Tag>
          </span>
        )
      },
    },

    {
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: ({ id, endDate }) => (
        <span>
          <Button
            disabled={new Date(endDate) > new Date()}
            type='link'
            onClick={async () => {
              await deleteCall('/semesters/' + id, token)
              fetchAllSemetsers(page)
            }}
          >
            Remove
          </Button>{' '}
        </span>
      ),
    },
  ]
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Semesters</h2>
      <Button
        type='primary'
        onClick={showDrawer}
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
      >
        New Semester
      </Button>
      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchAllSemetsers(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={semsters}
      />
      <Drawer
        title='Create a new Semester'
        width={600}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onOk} type='primary'>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout='vertical' form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Name'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Semester name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='tuition'
                label='Tuition'
                rules={[
                  {
                    required: true,
                    message: 'Please enter tuition in US $',
                  },
                ]}
              >
                <Input placeholder='$' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name='se'
                label='Start & End Dates'
                rules={[
                  {
                    required: true,
                    message: 'Please choose the dateTime',
                  },
                ]}
              >
                <DatePicker.RangePicker
                  style={{
                    width: '100%',
                  }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label='Registration Expiration'
                name='registrationExpiration'
                rules={[
                  {
                    required: true,
                    message: 'Please choose the dateTime',
                  },
                ]}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  getPopupContainer={(trigger) => trigger.parentElement}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='description'
                label='Description'
                rules={[
                  {
                    required: true,
                    message: 'please enter description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder='please enter description' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}
