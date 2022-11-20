import React, { useEffect, useState } from 'react'
import { SmileOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Card, Modal, Pagination, Skeleton, Space } from 'antd'
import { useSelector } from 'react-redux'
import { deleteCall, get } from '../../utils/apiCall'
import ApplicationForm from '../applicationForm/applicationForm'
import { useHistory } from 'react-router-dom'
const { confirm } = Modal

export default function KinderGartenCards({
  newKindergarten,
  children,
  appliable,
  url,
  childId,
  appliedK = [],
  onUpdate,
}) {
  const token = useSelector((state) => state.user.token)
  const [values, setValues] = useState({})
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const history = useHistory()
  const [page, setPage] = useState(1)
  const onPageChange = async (page) => {
    setLoading(true)
    setPage(page)
    const res = await get(
      `/kindergartens?pageNumber=${page}&pageSize=200&includeImages=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      setKindergartens(resJson.rows)
    }
    setLoading(false)
  }
  const fetchKindergartens = async () => {
    setLoading(true)
    const res = await get(url, token)
    if (res.ok) {
      const resJson = await res.json()
      setKindergartens(resJson.rows)
      setCount(resJson.count)
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
  const showApply = (e) => {
    const kindergartenId = e.currentTarget.getAttribute('value')
    setValues({ childId, kindergartenId })
    setOpen(true)
  }
  const showConfirm = async (e) => {
    const id = e.currentTarget.getAttribute('value')
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        setLoading(true)
        await deleteCall('/RegisterApplication/' + id, token)
        onUpdate()
        setLoading(false)
      },
    })
  }
  if (loading) {
    return (
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton loading={loading} active>
          <Card.Meta title='Card title' description='This is the description' />
        </Skeleton>
      </Card>
    )
  } else {
    return (
      <>
        <Space size={'large'} wrap>
          {kindergartens.map((kindergarten, index) => {
            const i = appliedK.map((e) => e.kindergartenId).indexOf(kindergarten.id)
            return (
              <Card
                className='card'
                style={{ width: 300, marginTop: 16, minHeight: 365 }}
                hoverable
                key={index}
                actions={
                  appliable
                    ? [
                        i !== -1 ? (
                          <Button
                            value={appliedK[i].id}
                            type='primary'
                            onClick={showConfirm}
                            block
                            style={{ height: '50px', backgroundColor: '#4e5565', border: 0 }}
                          >
                            withdraw
                          </Button>
                        ) : (
                          <Button
                            value={kindergarten.id}
                            type='primary'
                            onClick={showApply}
                            block
                            style={{ height: '50px', border: '0' }}
                          >
                            Apply
                          </Button>
                        ),
                      ]
                    : ''
                }
                cover={
                  kindergarten.imgs[0] ? (
                    <div
                      onClick={() =>
                        history.push('/child/' + childId + '/kindergarten/' + kindergarten.id)
                      }
                      alt='example'
                      className='cover'
                      style={{
                        backgroundImage: `url(
                      ${process.env.REACT_APP_API_URL + kindergarten.imgs[0]}
                    )`,
                      }}
                    />
                  ) : (
                    <SmileOutlined
                      onClick={() =>
                        history.push('/child/' + childId + '/kindergarten/' + kindergarten.id)
                      }
                      style={{ fontSize: 120, margin: '30px 0' }}
                    />
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
            )
          })}

          {children}
          <ApplicationForm
            appValues={values}
            open={open}
            onCancel={() => {
              setOpen(false)
            }}
            onUpdate={() => {
              setOpen(false)
              onUpdate()
            }}
          />
        </Space>
        <Pagination
          onChange={onPageChange}
          defaultCurrent={1}
          total={count}
          current={page}
          style={{ marginTop: '30px' }}
        />
      </>
    )
  }
}
