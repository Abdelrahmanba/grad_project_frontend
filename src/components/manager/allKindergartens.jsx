import { Table } from 'antd'
import React, { useState } from 'react'

export default function AllChildren() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const data = []
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ]
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>All Registered Kindergartens on the platform</h1>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  )
}
