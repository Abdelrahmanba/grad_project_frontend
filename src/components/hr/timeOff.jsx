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
  Select,
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
  const [cat, setCat] = useState([])

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { kid } = useParams()

  const [form] = Form.useForm()
  const [cform] = Form.useForm()

  const [open, setOpen] = useState(false)
  const [copen, setcOpen] = useState(false)

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
  const oncOk = async () => {
    const values = await cform.validateFields()
    const res = await post(`/timeoffcategories`, token, {
      ...values,
    })
    if (res.ok) {
      fetchAllCat(1)
    } else {
      const resJson = await res.json()
      message.error(resJson.msg)
    }
    form.resetFields()
    setOpen(false)
  }
  const onClose = async (e) => {
    setcOpen(false)
  }
  const fetchAllCat = async (page = 1) => {
    setLoading(true)
    const res = await get(`/timeoffcategories/kindergarten/${kid}?pageNumber=1&pageSize=10`, token)
    if (res.ok) {
      const resJson = await res.json()
      setCat(resJson.rows.map((cat) => ({ ...cat, value: cat.id, label: cat.categoryName })))
    }
    setLoading(false)
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
    fetchAllCat(1)
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
  const ccolumns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
              await deleteCall('/timeoffcategories/' + em.id, token)
              fetchAllCat(1)
              setLoading(false)
            }}
          >
            Delete
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
                  <Descriptions.Item key={'pcx' + index} label='Category'>
                    {b.time_off_category.categoryName}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pcx' + index} label='Category Description'>
                    {b.time_off_category.description}
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
        title='Add New Time off'
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='timeOffCategoryId'
                label='Category'
                rules={[
                  {
                    required: true,
                    message: 'Please enter category',
                  },
                ]}
              >
                <Select options={cat} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <h1 style={{ marginTop: 0 }}>Time Off Catagories</h1>
      <Button type='primary' onClick={() => setcOpen(true)}>
        {' '}
        Add Catagory
      </Button>
      <Drawer
        title='Add New Timeoff Catagory'
        width={450}
        onClose={onClose}
        open={copen}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={oncOk} type='primary'>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout='vertical' form={cform}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item initialValue={kid} name='kindergartenId'>
                <Input hidden />
              </Form.Item>
              <Form.Item
                name='categoryName'
                label='Name'
                rules={[
                  {
                    required: true,
                    message: 'Please enter name',
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
                name='description'
                label='Description'
                rules={[
                  {
                    required: true,
                    message: 'Please enter description',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Table bordered size='large' loading={loading} columns={ccolumns} dataSource={cat} />
    </div>
  )
}
