import { Card, Skeleton } from 'antd'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { get } from '../../utils/apiCall'
import AddButton from '../addButton/addButton'
import Section from '../section/section'

export default function ParentDashboard() {
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true)
      const res = await get('/children/me', token)
      if (res.ok) {
        const resJson = await res.json()
        setChildren(resJson)
      }
      setLoading(false)
    }
    fetchChildren()
  }, [])

  const onFinish = (val) => {
    setChildren((children) => [...children, val])
  }

  return (
    <>
      <Section title={'Current Children'}>
        {children.map((child) => (
          <Card style={{ width: 300, marginTop: 16 }} hoverable>
            <Skeleton loading={loading} avatar active>
              <Card.Meta
                title={child.firstName + ' ' + child.lastName}
                description='This is the description'
              />
            </Skeleton>
          </Card>
        ))}

        {loading && (
          <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} active>
              <Card.Meta title='Card title' description='This is the description' />
            </Skeleton>
          </Card>
        )}
        <AddButton title={'Add A New Child'} type={'child'} onFinish={onFinish} />
      </Section>
    </>
  )
}
