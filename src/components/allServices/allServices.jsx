import { Button, Card, Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { useHistory, useParams } from 'react-router'

export default function AllServices() {
  const history = useHistory()
  const { kid } = useParams()
  return (
    <>
      <h1>Available Services</h1>
      <Card
        hoverable
        bodyStyle={{
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
        }}
        style={{ width: 300 }}
        cover={
          <img
            alt='example'
            src='https://i2.wp.com/hr-gazette.com/wp-content/uploads/2018/10/bigstock-Recruitment-Concept-Idea-Of-C-250362193.jpg?fit=1600%2C900&ssl=1'
          />
        }
      >
        <Card.Meta title={<h3>HR Managament</h3>} />
        <Button block type='primary' onClick={() => history.push('/hr/' + kid)}>
          Learn More
        </Button>
      </Card>
    </>
  )
}
