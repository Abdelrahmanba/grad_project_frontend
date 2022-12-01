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
  Space,
  Table,
} from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, patchCall, post } from '../../utils/apiCall'

export default function Jobs() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const token = useSelector((state) => state.user.token)
  const [count, setCount] = useState(0)
  const [jobs, setJobs] = useState([])
  const [freq, setFreq] = useState({})

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { kid } = useParams()

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)

  const onOk = async () => {
    const values = await form.validateFields()
    const res = await post(`/jobs`, token, { ...values, kindergartenId: kid })
    if (res.ok) {
      fetchAllJobs(page)
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
        ...e,
        key: e.id,
      }))
      setFreq(resJson.jobFreqs)
      setJobs(parsed)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchAllJobs()
  }, [])

  const columns = [
    {
      title: 'Title',
      dataIndex: 'jobTitle',
      key: 'title',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'No. Of Employees',
      key: 'emp',
      render: (e) => {
        return freq[e.jobTitle]
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
              fetchAllJobs(page)
              setLoading(false)
            }}
          >
            Edit
          </Button>
          <Button
            type='link'
            onClick={async () => {
              setLoading(true)
              await deleteCall('/jobs/' + id, token)
              fetchAllJobs(page)
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
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Jobs</h2>
      <Button
        type='primary'
        onClick={showDrawer}
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
      >
        New Job
      </Button>
      <Table
        bordered
        size='large'
        pagination={{
          onChange: (page) => fetchAllJobs(page),
          defaultCurrent: 1,
          total: count,
          current: page,
          pageSize: 10,
          position: ['bottomLeft'],
        }}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={jobs}
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
                name='jobTitle'
                label='Job Title'
                rules={[
                  {
                    required: true,
                    message: 'Please enter Job Title',
                  },
                ]}
              >
                <Input />
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
