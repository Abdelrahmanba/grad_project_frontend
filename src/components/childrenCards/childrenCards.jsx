import React, { useEffect, useState } from 'react'
import {
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Card, Modal, Skeleton, Space } from 'antd'
import { useSelector } from 'react-redux'
import { deleteCall, get } from '../../utils/apiCall'
const { confirm } = Modal

export default function ChildrenCards({ newChild }) {
  const token = useSelector((state) => state.user.token)

  const fetchChildren = async () => {
    setLoading(true)
    const res = await get('/children/me', token)
    if (res.ok) {
      const resJson = await res.json()
      setChildren(resJson)
    }
    setLoading(false)
  }
  useEffect(() => {
    const funCall = async () => {
      await fetchChildren()
    }
    funCall()
  }, [])

  useEffect(() => {
    setChildren((children) => [...children, newChild])
  }, [newChild])

  const showConfirm = async (e) => {
    const id =
      e.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute(
        'value'
      )
    confirm({
      title: 'Are you sure delete this child?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        setLoading(true)
        await deleteCall('/children/' + id, token)
        await fetchChildren()
        setLoading(false)
      },
    })
  }
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  if (loading) {
    return (
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton loading={loading} active>
          <Card.Meta title="Card title" description="This is the description" />
        </Skeleton>
      </Card>
    )
  } else {
    return (
      <Space size={'large'}>
        {children.map((child, index) => (
          <Card
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <DeleteOutlined key="DeleteOutlined" onClick={showConfirm} />,
            ]}
            style={{ width: 300, marginTop: 16 }}
            hoverable
            key={index}
            value={child.id}
          >
            <Skeleton loading={loading} avatar active>
              <Card.Meta
                title={child.firstName + ' ' + child.lastName}
                description="This is the description"
              />
            </Skeleton>
          </Card>
        ))}
      </Space>
    )
  }
}
