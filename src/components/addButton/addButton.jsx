import { Card } from 'antd'
import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import './addButton.scss'
import AddChildForm from '../addChildForm/addChildForm'
import { useState } from 'react'
import AddKindergartenForm from '../addKindergartenForm/addKindergartenForm'

export default function AddButton({ title, type, onFinish }) {
  const [open, setOpen] = useState(false)

  const onCreate = async (values) => {
    onFinish(values)
    setOpen(false)
  }
  return (
    <>
      <Card
        hoverable
        style={{ width: 300 }}
        onClick={() => setOpen(true)}
        className="add-button"
      >
        <PlusOutlined className="add-button-icon" />
        <Card.Meta description={title} />
      </Card>
      {type === 'child' ? (
        <AddChildForm
          open={open}
          type="add"
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false)
          }}
        />
      ) : (
        <AddKindergartenForm
          open={open}
          type="add"
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false)
          }}
        />
      )}
    </>
  )
}
