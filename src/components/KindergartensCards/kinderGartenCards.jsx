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

export default function KinderGartenCards({ newKindergarten }) {
  const token = useSelector((state) => state.user.token)

  const fetchKindergartens = async () => {
    setLoading(true)
    const res = await get(
      '/kindergartens?pageNumber=1&includeImages=true',
      token
    )

    if (res.ok) {
      const resJson = await res.json()
      setKindergartens(resJson.rows)
    }
    setLoading(false)
  }
  useEffect(() => {
    const funCall = async () => {
      await fetchKindergartens()
    }
    funCall()
  }, [])

  useEffect(() => {
    setKindergartens((kindergartens) => [...kindergartens, newKindergarten])
  }, [newKindergarten])

  const showConfirm = async (e) => {
    const id =
      e.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute(
        'value'
      )
    confirm({
      title: 'Are you sure delete this kindergarten?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        setLoading(true)
        await deleteCall('/kindergartens/' + id, token)
        await fetchKindergartens()
        setLoading(false)
      },
    })
  }
  const [kindergartens, setKindergartens] = useState([])
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
      <Space size={'large'} wrap>
        {kindergartens.map((kindergarten, index) => (
          <Card
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <DeleteOutlined key="DeleteOutlined" onClick={showConfirm} />,
            ]}
            style={{ width: 300, marginTop: 16 }}
            hoverable
            key={index}
            value={kindergarten.id}
          >
            <Skeleton loading={loading} avatar active>
              <Card.Meta
                title={kindergarten.name}
                description={kindergarten.locationFormatted}
              />
            </Skeleton>
          </Card>
        ))}
      </Space>
    )
  }
}
