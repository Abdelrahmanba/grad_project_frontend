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
  const fetchAllBounses = async (id) => {
    setLoading(true)
    setPage(page)

    const res = await get(
      `/bonuses/employee/${id}?pageNumber=1&pageSize=10&includeEmployee=false`,
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
        const b = await fetchAllBounses(emp.id)
        emp.bounses = b
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
            Add Bonus
          </Button>
        </span>
      ),
    },
  ]


  const showDrawer = () => {
    setOpen(true)
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Bounses</h1>

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
          rowExpandable: (record) => record.bounses.length !== 0,
          expandedRowRender: (record) =>
            record.bounses.map((b, index) => (
              <>
                <Descriptions column={2} key={index} title='Bonuses'>
                  <Descriptions.Item key={'p' + index} label='Amount'>
                    {b.amount}
                  </Descriptions.Item>
                  <Descriptions.Item key={'pc' + index} label='Date'>
                    {b.createdAt}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type='link'
                  onClick={async () => {
                    await deleteCall('/bonuses/' + b.id, token)
                    await fetchAllEmployees()
                  }}
                >
                  Delete Bonus
                </Button>
                {index !== record.bounses.length - 1 && <Divider />}
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
