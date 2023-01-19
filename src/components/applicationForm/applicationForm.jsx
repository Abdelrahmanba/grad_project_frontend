import { Button, Form, message, Modal, Upload } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { post, postFile } from '../../utils/apiCall'
import { UploadOutlined } from '@ant-design/icons'

const ApplicationForm = ({ open, onCancel, appValues, onUpdate }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)

  const [file, setFile] = useState({})

  const dummyReq = ({ data, file, onSuccess }) => {
    const formData = new FormData()
    formData.set('document', file)
    setFile(formData)
    setTimeout(() => onSuccess('ok'), 0)
  }

  return (
    <Modal
      open={open}
      title='Apply for Kindergarten'
      okText='Apply'
      cancelText='Cancel'
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={async () => {
        setLoading(true)
        const foValues = await form.validateFields()
        const res = await post('/RegisterApplication', token, appValues)
        if (res.ok) {
          const resJson = await res.json()
          const resFile = await postFile(
            '/files/document/RegisterApplication/' + resJson.id,
            token,
            file
          )
          if (resFile.ok) {
            message.success('Added Successfully')
          } else {
            message.error('Something Went Wrong')
          }
          form.resetFields()
        } else{
          const resJson = await res.json()
          message.error(resJson.msg)
        }
        form.resetFields()
        onUpdate()
        setLoading(false)
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal'>
        <Form.Item
          label='Birth Certificate'
          tooltip='Add any documents that could support your application'
          rules={[
            {
              required: true,
              message: 'Please input your lindergarten photos!',
            },
          ]}
        >
          <Upload maxCount={1} customRequest={dummyReq}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ApplicationForm
