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
import Search from 'antd/lib/input/Search'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, post } from '../../utils/apiCall'

export default function Bounses() {
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

  const onOk = async () => {
    const values = await form.validateFields()
    console.log(values)
    const res = await post(`/bonuses`, token, {
      ...values,
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
  const fetchAllEmployees = async (page = 1,value="") => {
    setLoading(true)
    setPage(page)

    const res = await get(`/bonuses/kindergarten/2?includeEmployee=true&includeJob=false&searchQuery=${value}`, token)
    if (res.ok) {
      const resJson = await res.json()
      const parsed = resJson.rows.map((e) => ({
        ...e,
        key: e.id,
        ...{ ...e.employee },
      }))
      console.log(parsed)
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
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },

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
      title: 'Actions',
      key: 'Actions',
      render: (r) => (
        <Button
          type='link'
          onClick={async () => {
            await deleteCall('/bonuses/' + r.id, token)
            await fetchAllEmployees()
          }}
        >
          Delete Bonus
        </Button>
      ),
    },
  ]

  const showDrawer = () => {
    setOpen(true)
  }
  const onSearch = async (value) => {
    console.log(value)
    await fetchAllEmployees(page, value)
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Bounses</h1>
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
                name='amount'
                label='Amount'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Amount',
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
