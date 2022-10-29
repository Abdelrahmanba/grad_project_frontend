import { Button, Card, Col, Divider, Layout, Row, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'

export default function Dashboard() {
  return (
    <Layout className='layout'>
      <Content className='content'>
        <h1>Welcome NAME.</h1>
        <Divider orientation='left' className='divider'>
          Current Children
        </Divider>
        <Space size={'large'} style={{ padding: '20px 0 20px' }} wrap>
          <Card
            hoverable
            style={{ width: 300 }}
            cover={
              <img
                alt='example'
                src='https://www.incimages.com/uploaded_files/image/1920x1080/getty_168318604_69878.jpg'
              />
            }
          >
            <Card.Meta title='Child 1 ' description='Enrollled in KINDERGARTEN NAME' />
          </Card>
          <Card
            hoverable
            style={{ width: 300 }}
            cover={
              <img
                alt='example'
                src='https://www.incimages.com/uploaded_files/image/1920x1080/getty_168318604_69878.jpg'
              />
            }
          >
            <Card.Meta title='Child 2 ' description='Looking for kindergarten' />
          </Card>
          <Card
            hoverable
            style={{ width: 300 }}
            cover={
              <img
                alt='example'
                src='https://www.incimages.com/uploaded_files/image/1920x1080/getty_168318604_69878.jpg'
              />
            }
          >
            <Card.Meta title='Child 1 ' description='Nice Child' />
          </Card>
        </Space>
        <Row>
          <Col>
            <Button type='primary'>Add a new child</Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
