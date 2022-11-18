import React, { useEffect, useState } from 'react'
import {
  SmileOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Card, Modal, Skeleton, Space } from 'antd'
import { useSelector } from 'react-redux'
import { deleteCall, get } from '../../utils/apiCall'
const { confirm } = Modal

export default function KinderGartenCards({
  newKindergarten,
  children,
  appliable,
  url,
}) {
  const token = useSelector((state) => state.user.token)
  const [values, setValues] = useState({})
  const [open, setOpen] = useState(false)

  const fetchKindergartens = async () => {
    setLoading(true)
    const res = await get(url, token)

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
            className="card"
            style={{ width: 300, marginTop: 16 }}
            hoverable
            key={index}
            actions={
              appliable
                ? [
                    <Button type="primary" block style={{ height: '50px' }}>
                      Apply
                    </Button>,
                  ]
                : ''
            }
            cover={
              kindergarten.imgs[0] ? (
                <div
                  alt="example"
                  className="cover"
                  style={{
                    backgroundImage: `url(
                      ${process.env.REACT_APP_API_URL + kindergarten.imgs[0]}
                    )`,
                  }}
                />
              ) : (
                <SmileOutlined style={{ fontSize: 120, margin: '30px 0' }} />
              )
            }
          >
            <Skeleton loading={loading} avatar active>
              <Card.Meta
                title={kindergarten.name}
                description={kindergarten.locationFormatted}
              />
            </Skeleton>
          </Card>
        ))}
        {children}
      </Space>
    )
  }
}
