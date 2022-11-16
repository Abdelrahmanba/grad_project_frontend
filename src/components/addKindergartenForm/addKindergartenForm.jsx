import { AutoComplete, Button, Form, Input, message, Modal, Upload } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { post, postFile } from '../../utils/apiCall'
import Map from '../../components/map/map'
import { UploadOutlined } from '@ant-design/icons'

const AddKindergartenForm = ({ open, onCancel, onCreate, type }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const [position, setposition] = useState({})
  const onChange = (val) => {
    setposition(val)
  }
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
      setAutoCompleteResult(
        ['.com', '.org', '.net', '.edu'].map((domain) => `${value}${domain}`)
      )
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
      title="Register A New Kindergarten"
      okText="Add Kindergarten"
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={async () => {
        let imgURLs = []
        setLoading(true)
        const values = await form.validateFields()
        const res = await post('/kindergartens', token, {
          ...values,
          ...position,
        })
        if (res.ok) {
          message.success('Added Successfully')
          const resJson = await res.json()
          images.forEach(async (image) => {
            const resImage = await postFile(
              '/files/image/kindergarten/' + resJson.id,
              token,
              image
            )
            if (resImage.ok) {
              const imgURL = await resImage.json()
              imgURLs = [...imgURLs, imgURL.imgs]
              console.log(imgURLs)
              onCreate({ ...resJson, imgs: imgURLs })
            }
          })

          form.resetFields()
        } else {
          message.error('Something Went Wrong')
        }

        setLoading(false)
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Kindergarten Name"
          tooltip="Your official kindergarent name"
          rules={[
            {
              required: true,
              message: 'Please input your kindergarent name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Contact E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          name="website"
          label="Website"
          rules={[
            {
              required: true,
              message: 'Please input website!',
            },
          ]}
        >
          <AutoComplete
            options={websiteOptions}
            onChange={onWebsiteChange}
            placeholder="website"
          >
            <Input />
          </AutoComplete>
        </Form.Item>
        <Form.Item
          label="Photos"
          rules={[
            {
              required: true,
              message: 'Please input your lindergarten photos!',
            },
          ]}
        >
          <Upload maxCount={5} accept="image/*" customRequest={dummyReq}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="about"
          label="About"
          tooltip="Please tell us more about your kindergarten"
          rules={[
            {
              required: true,
              message: 'Please input this field',
            },
          ]}
        >
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>
        <Form.Item name="Kaddress" label="Address">
          <Map onChange={onChange} />
        </Form.Item>
        <Form.Item {...mapLayout}></Form.Item>
      </Form>{' '}
    </Modal>
  )
}

export default AddKindergartenForm
