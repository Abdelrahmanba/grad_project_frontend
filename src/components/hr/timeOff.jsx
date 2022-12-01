import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Space,
  Table,
} from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, post } from '../../utils/apiCall'

export default function TimeOff() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [employees, setEmployees] = useState([])
  const [jobs, setJobs] = useState([])
  const [employee, setEmployee] = useState({})

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { kid } = useParams()

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const fetchAllJobs = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/jobs/kindergarten/${kid}?pageNumber=${page}&pageSize=10&includeKindergarten=false`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        label: e.jobTitle,
        value: e.id,
      }))
      setJobs(parsed)
    }
    setLoading(false)
  }
  const fetchAllT = async (id) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/timeoffs/employee/${id}?pageNumber=1&pageSize=10&includeTimeOffCategory=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      return resJson.rows
    }
    setLoading(false)
  }

  const onOk = async () => {
    const values = await form.validateFields()
    const res = await post(`/timeoffs`, token, {
      ...values,
      timeOffCategoryId:2,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    })
    if (res.ok) {
      fetchAllEmployees(page)
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
  const fetchAllEmployees = async (page = 1) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/employees/kindergarten/${kid}?pageNumber=${page}&pageSize=10&includeKindergarten=false`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))

      for (const emp of parsed) {
        const b = await fetchAllT(emp.id)
        emp.timeOff = b
      }
      setEmployees(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllJobs()
    fetchAllEmployees()
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Hire Date',
      dataIndex: 'hireDate',
      key: 'hireDate',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: 'Job',
      key: 'jobId',
      render: ({ jobId }) => {
        const job = jobs.find((e) => e.value == jobId)
        if (job) {
          return job.label
        } else {
          return ''
        }
      },
    },
    {
      title: 'Actions',
      key: 'operation',
      fixed: 'right',
      width: 170,
      render: (em) => (
        <span>
          <Button
            type='link'
            onClick={async () => {
              setLoading(true)
              setOpen(true)
              setEmployee(em)
              fetchAllEmployees(page)
              setLoading(false)
            }}
          >
            Add Time Off
          </Button>
        </span>
      ),
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

  const showDrawer = () => {
    setOpen(true)
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Time Off</h1>

      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchAllEmployees(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        columns={columns}
        dataSource={employees}
        expandable={{
          childrenColumnName: 'none',
          rowExpandable: (record) => record.timeOff.length !== 0,
          expandedRowRender: (record) =>
            record.timeOff.map((b, index) => (
              <>
                <Descriptions column={2} key={index} title='Time Off'>
                  <Descriptions.Item key={'p' + index} label='duration'>
                    {b.duration}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pcxx' + index} label='Start Date'>
                    {b.startDate}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pcx' + index} label='End Date'>
                    {b.endDate}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pcx' + index} label='Duration'>
                    {b.duration}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pcx' + index} label='Note'>
                    {b.note}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type='link'
                  onClick={async () => {
                    await deleteCall('/timeoffs/' + b.id)
                    await fetchAllEmployees()
                  }}
                >
                  Delete Time Off
                </Button>
                {index !== record.timeOff.length - 1 && <Divider />}
              </>
            )),
        }}
      />
      <Drawer
        title='Add New Bouns'
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
                initialValue={employee.id}
                name='employeeId'
                label={employee.firstName + ' ' + employee.lastName}
              >
                <Input hidden />
              </Form.Item>
              <Form.Item
                name='note'
                label='Note'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Note',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='startDate' label={'Start Date'}>
                <DatePicker />
              </Form.Item>
              <Form.Item
                name='endDate'
                label='End Date'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Amount',
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='duration'
                label='duration'
                rules={[
                  {
                    required: true,
                    message: 'Please enter duration',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}
