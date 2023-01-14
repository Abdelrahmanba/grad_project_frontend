import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import Search from 'antd/lib/input/Search'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, post } from '../../utils/apiCall'

export default function Employees() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [employees, setEmployees] = useState([])
  const [jobs, setJobs] = useState([])

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

  const onOk = async () => {
    const values = await form.validateFields()
    const res = await post(`/employees`, token, {
      ...values,
      hireDate: values.hireDate.format('YYYY-MM-DD'),
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
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
  const fetchAllEmployees = async (page = 1, value = '') => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/employees/kindergarten/${kid}?pageNumber=${page}&pageSize=10&includeKindergarten=false&searchQuery=${value}`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
      }))
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
      render: ({ id, jobTitle, description }) => (
        <span>
          <Button
            type='link'
            onClick={async () => {
              setLoading(true)
              setOpen(true)
              fetchAllEmployees(page)
              setLoading(false)
            }}
          >
            Edit
          </Button>
          <Button
            type='link'
            onClick={async () => {
              setLoading(true)
              await deleteCall('/employees/' + id, token)
              fetchAllEmployees(page)
              setLoading(false)
            }}
          >
            Remove
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
  const onSearch = async (value) => {
    console.log(value)
    await fetchAllEmployees(page, value)
  }
  

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Employees</h1>
      <Space direction='vertical'>
        <Search
          placeholder='input search text'
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
        <Button
          type='primary'
          onClick={showDrawer}
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
        >
          New Employee
        </Button>
      </Space>
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
        rowSelection={rowSelection}
        columns={columns}
        dataSource={employees}
      />
      <Drawer
        title='Add new Employee'
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
                name='firstName'
                label='First Name'
                rules={[
                  {
                    required: true,
                    message: 'Please enter First Name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='lastName'
                label='Last Name'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Last Name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Email',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='phone'
                label='phone'
                rules={[
                  {
                    required: true,
                    message: 'Please enter phone',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='country'
                label='Country'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Country',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='city'
                label='City'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Last Name',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='hireDate'
                label='Hire Date'
                rules={[
                  {
                    required: true,
                    message: 'Please enter hireDate',
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='dateOfBirth'
                label='Date Of Birth'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Last Name',
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
                name='salary'
                label='Salary'
                rules={[
                  {
                    required: true,
                    message: 'Please enter salary',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='jobId'
                label='Job'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Job',
                  },
                ]}
              >
                <Select options={jobs} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}
