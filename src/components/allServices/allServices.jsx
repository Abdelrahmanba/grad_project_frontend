import { Button, Card, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { LockOutlined } from '@ant-design/icons'

export default function AllServices({ onClick, sub }) {
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
        <Button block type='primary' onClick={onClick}>
          {sub === 0 ? (
            <>
              <LockOutlined /> Learn More
            </>
          ) : (
            'Unlocked'
          )}
        </Button>
      </Card>
    </>
  )
}
