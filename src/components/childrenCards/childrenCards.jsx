import React, { useEffect, useState } from 'react'
import moment from 'moment'

import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { Card, Modal, Skeleton, Space } from 'antd'
import { useSelector } from 'react-redux'
import { deleteCall, get } from '../../utils/apiCall'
import './childrenCards.scss'
import AddChildForm from '../addChildForm/addChildForm'
import { useHistory } from 'react-router-dom'

const { confirm } = Modal

export default function ChildrenCards({ newChild, children: childrenProps }) {
  const user = useSelector((state) => state.user)
  const { token } = user
  const history = useHistory()
  const status = { 1: 'Looking for Kindergarten', 2: 'Enrolled' }
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

  const showEdit = (e) => {
    const index = e.currentTarget.getAttribute('value')

    const defaults = (({ firstName, middleName, lastName, gender, id, dateOfBirth }) => ({
      firstName,
      middleName,
      lastName,
      gender,
      id,
      dateOfBirth: moment(dateOfBirth, 'YYYY-MM-DD'),
    }))(children[index])
    setValues(defaults)
    setOpen(true)
  }
  const showConfirm = async (e) => {
    const id = e.currentTarget.getAttribute('value')
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

  const onUpdate = async (values) => {
    const index = children.findIndex((e) => e.id === values.id)
    children[index] = { ...values, imgs: values.imgs }
    setOpen(false)
  }
  useEffect(() => {
    setChildren((children) => [...children, newChild])
  }, [newChild])

  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({})

  if (loading) {
    return (
      <Card style={{ width: 300, marginTop: 16, minHeight: 340 }}>
        <Skeleton loading={loading} active>
          <Card.Meta title='Card title' description='This is the description' />
        </Skeleton>
      </Card>
    )
  } else {
    return (
      <Space size={'large'} wrap>
        {children.map((child, index) => (
          <Card
            actions={[
              <MessageOutlined
                style={{ margin: ' 15px 0' }}
                key='message'
                onClick={() => history.push('/messages/' + child.id)}
              />,
              <EditOutlined
                style={{ margin: ' 15px 0' }}
                key='edit'
                value={index}
                onClick={showEdit}
              />,
              <DeleteOutlined
                style={{ margin: '15px 0' }}
                value={child.id}
                key='DeleteOutlined'
                onClick={showConfirm}
              />,
            ]}
            className={'card'}
            style={{ width: 300, marginTop: 16 }}
            hoverable
            key={index}
            cover={
              child.imgs[0] ? (
                <div
                  onClick={() => history.push('/child/' + child.id)}
                  alt='example'
                  className='cover'
                  style={{
                    backgroundImage: `url(
                      ${process.env.REACT_APP_API_URL + child.imgs[0]}
                    )`,
                  }}
                />
              ) : (
                <UserOutlined
                  onClick={() => history.push('/child/' + child.id)}
                  style={{ fontSize: 120, margin: '30px 0' }}
                />
              )
            }
          >
            <Skeleton loading={loading} avatar active>
              <Card.Meta
                title={child.firstName + ' ' + child.lastName}
                description={status[child.childStatusId]}
              />
            </Skeleton>
          </Card>
        ))}
        {childrenProps}
        <AddChildForm
          open={open}
          defaultValues={values}
          type='update'
          onUpdate={onUpdate}
          onCancel={() => {
            setOpen(false)
          }}
        />
      </Space>
    )
  }
}
