import { Button, DatePicker, Col, Drawer, Form, Input, Row, Space, Table, Tag, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom'
import { deleteCall, get, post } from '../../utils/apiCall'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function PlansAdmin({ onClick }) {
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
        const res = await post(`/plans`, token, {
            ...values,
            serviceId: 1
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

        const res = await get(`/plans/services/1`, token)
        if (res.ok) {
            const resJson = await res.json()
            const parsed = resJson.map((e) => ({
                ...e,
                key: e.id,
            }))
            console.log(parsed)
            setSemsters(parsed)
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
                n.name
            ),
        },
        {
            title: 'Duration In Months',
            dataIndex: 'durationInMonths',
            key: 'durationInMonths',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
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
                            await deleteCall('/plans/' + id, token)
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
            <h2 style={{ marginTop: 0 }}>Plans</h2>
            <Button
                type='primary'
                onClick={showDrawer}
                icon={<PlusOutlined />}
                style={{ marginBottom: 20 }}
            >
                New Plan
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
                                        message: 'Please enter service name',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='durationInMonths'
                                label='Duration'
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

                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name='price'
                                label='Price'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose the price',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                   
                </Form>
            </Drawer>
        </div>
    )
}
