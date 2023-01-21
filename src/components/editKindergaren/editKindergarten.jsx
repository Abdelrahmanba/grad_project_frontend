import { AutoComplete, Button, Form, Input, message, Modal, Upload } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { post, postFile } from '../../utils/apiCall'
import Map from '../../components/map/map'
import { UploadOutlined } from '@ant-design/icons'
import { doc, setDoc, getFirestore } from 'firebase/firestore'
import { patchCall } from '../../utils/apiCall'

const EditKindergartenForm = ({ open, onCancel, onCreate, type,defaultValues }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const [position, setposition] = useState({})
  const onChange = (val) => {
    setposition(val)
  }
  const db = getFirestore()

  const [images, setImage] = useState([])

  const [autoCompleteResult, setAutoCompleteResult] = useState([])
  const dummyReq = ({ data, file, onSuccess }) => {
    const formData = new FormData()
    formData.set('image', file)
    setImage((images) => [formData, ...images])

    setTimeout(() => onSuccess('ok'), 0)
  }

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([])
    } else {
      setAutoCompleteResult(['.com', '.org', '.net', '.edu'].map((domain) => `${value}${domain}`))
    }
  }

  const mapLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 4,
      },
    },
  }
  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }))
  return (
    <Modal
      open={open}
      title='Edit A Kindergarten'
      okText='Edit Kindergarten'
      cancelText='Cancel'
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={async () => {
        let imgURLs = []
        setLoading(true)
        const values = await form.validateFields()
        delete values.Kaddress
        delete values.country
        delete values.geometry
        const pos = position
        delete pos.geometry
        delete pos.country

        const res = await patchCall('/kindergartens/'+defaultValues.id, token, {
          ...values,
          ...pos,
        })
        onCreate()


        setLoading(false)
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal' initialValues={defaultValues}>
        <Form.Item
          name='name'
          label='Kindergarten Name'
          tooltip='Your official kindergarent name'
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='email'
          label='Contact E-mail'
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
           
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='phone'
          label='Phone Number'
         
        >
          <Input
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

       
        <Form.Item
          name='about'
          label='About'
          tooltip='Please tell us more about your kindergarten'
        >
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>
        <Form.Item name='Kaddress' label='Address'>
          <Map onChange={onChange} />
        </Form.Item>
        <Form.Item {...mapLayout}></Form.Item>
      </Form>{' '}
    </Modal>
  )
}

export default EditKindergartenForm
