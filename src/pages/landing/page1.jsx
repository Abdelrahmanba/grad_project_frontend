import { Button, Col, Row, Space } from 'antd'
import React from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import Page from '../../assets/page1.png'
import { useHistory } from 'react-router-dom'

export default function Page1() {
  const history = useHistory()
  return (
    <section className='page1'>
      <Row justify='space-evenly'>
        <Col xs={24} offset={2} md={10}>
          <h2>Find</h2>
          <h1>The Best Kindergarten</h1>
          <h3>For your children</h3>
          <p>
            We partner with over 99 kindergartens to provide you with the best choice possible for
            your beloved children ..
          </p>
          <Space wrap={true} className='btn-grp'>
            <Button
              type='primary'
              className='btn prm'
              icon={<ArrowRightOutlined />}
              onClick={() => history.push('/register-child')}
            >
              <div>
                <h4>Looking for a kindergarten?</h4>
                <span>Register your child</span>
              </div>
            </Button>
            <Button className='btn' onClick={() => history.push('/register-kindergarten')}>
              <h4>Kindergarten Owner?</h4>
              <span>Be part of us!</span>
            </Button>
          </Space>
        </Col>
        <Col xs={24} md={12} className='img'>
          <img src={Page} className='page1-img' alt="haha"/>
        </Col>
      </Row>
    </section>
  )
}
