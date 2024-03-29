import {
  Avatar,
  Button,
  Card,
  Carousel,
  Comment,
  Form,
  Layout,
  message,
  Rate,
  Space,
  Statistic,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { get, post } from '../../utils/apiCall'
import L from 'leaflet'
import { imgs } from '../../utils/kindergartenImgs'

import './kindergartenHome.scss'
import TextArea from 'antd/lib/input/TextArea'
import ApplicationForm from '../../components/applicationForm/applicationForm'

export default function KindergartenHome({onUpdate = ()=>{}}) {
  let { cid, kid } = useParams()
  const history = useHistory()
  const [values, setValues] = useState({})
  const [open, setOpen] = useState(false)

  const [kindergarten, setKindergarten] = useState({ imgs: [],runningSemester:{} })
  const [reviews, setReviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')
  const [rating, setRating] = useState(0)
  const [rate, setRate] = useState(0)
  const pid = useSelector((state) => state.user.user.id)

  const token = useSelector((state) => state.user.token)
  const fetchK = async () => {
    const res = await get(`/kindergartens/${kid}?includeRunningSemester=true`, token)
    if (res.ok) {
      const resJson = await res.json()
      console.log(resJson)
      setKindergarten(resJson)
    } else {
      history.push('/NotFound')
    }
  }
  const fetchR = async () => {
    const res = await get(
      `/reviews/kindergartens/${kid}?pageNumber=1&pageSize=5&includeParent=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      setReviews(resJson.rows)
      setRate({ rate: resJson.avgRating, no: resJson.numberOfRaters })
    } else {
      history.push('/NotFound')
    }
  }

  const showApply = (e) => {
    const semesterId = e.currentTarget.getAttribute('value')
    setValues({ childId:cid, semesterId })
    setOpen(true)
  }

  const handleSubmit = async () => {
    if (!value) return
    let reviewed = false
    reviews.forEach((r) => {
      if (r.userId === pid) {
        message.error('You already reviewd this kindergarten')
        reviewed = true
      }
    })
    if (reviewed) return
    setSubmitting(true)
    const res = await post('/reviews', token, {
      comment: value,
      rating: rating,
      kindergartenId: kid,
    })
    if (res.ok) {
      const resJson = await res.json()
      setSubmitting(false)
      setValue('')
      setRating(0)
      setReviews([...reviews, { ...resJson, user: { firstName: 'Me', lastName: '' } }])
    }
  }

  useEffect(() => {
    fetchK()
    fetchR()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Layout className='layout' style={{ backgroundColor: '#efefef', alignItems: 'center' }}>
      <Content
        className='content'
        style={{ backgroundColor: '#efefef', paddingTop: 0, width: '80vw', maxWidth: 1600 }}
      >
        <Card
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
          }}
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%' }}
          cover={
            kindergarten.imgs[0] ? (
              <div
                className='kbg'
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_API_URL + kindergarten.imgs[0]})`,
                }}
              />
            ) : (
              <div
                className='kbg'
                style={{
                  backgroundImage: `url(${imgs[Math.floor(Math.random() * (8 - 0 + 1)) + 0]})`,
                }}
              />
            )
          }
        >
          <Card.Meta
            title={<h2 style={{ margin: 0 }}>{kindergarten.name}</h2>}
            description={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>
                  <Rate disabled value={rate.rate} />
                  {rate.no + ' Reviews'}
                </span>
                {kindergarten.locationFormatted}
              </div>
            }
          />
          <span>
            {cid && (
              <Space size={'small'} direction='vertical'>
                <Button type='primary' style={{ width: 180, height: 40 }} onClick={showApply} value={kindergarten.runningSemester.id}>
                  Apply
                </Button>
                <Button
                  type='default'
                  onClick={() => history.push('/messages/' + cid + '/' + kid)}
                  style={{ width: 180, height: 40 }}
                >
                  Contact
                </Button>
              </Space>
            )}
          </span>
        </Card>
        <Card
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
          title={<h2 style={{ margin: 0 }}>Info</h2>}
        >
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            Email
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            {kindergarten.email}
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            Website
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            {kindergarten.website}
          </Card.Grid>
        </Card>
        <Card
          title={<h2 style={{ margin: 0 }}>Map</h2>}
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
        >
          {kindergarten.longitude && (
            <MapContainer
              center={[kindergarten.latitude, kindergarten.longitude]}
              zoom={15}
              scrollWheelZoom={true}
              style={{ height: 400 }}
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker
                position={[kindergarten.latitude, kindergarten.longitude]}
                icon={L.icon({
                  iconSize: [25, 41],
                  iconAnchor: [10, 41],
                  popupAnchor: [2, -40],
                  iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
                })}
              />
            </MapContainer>
          )}
        </Card>
        <Card
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
          title={<h2 style={{ margin: 0 }}>{kindergarten.runningSemester.name}</h2>}
        >
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='Per Term' value={kindergarten.runningSemester.tuition} suffix='USD' />
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='Start Date' value={kindergarten.runningSemester.startDate} />
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='End Date' value={kindergarten.runningSemester.endDate} />
          </Card.Grid> <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='Registeration End' value={kindergarten.runningSemester.registrationExpiration} />
          </Card.Grid>
        </Card>

        <Card
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
          title={<h2 style={{ margin: 0 }}>Gallery</h2>}
        >
          <Carousel effect='fade' autoplay>
            {kindergarten.imgs.map((e, i) => (
              <img key={i} src={`${process.env.REACT_APP_API_URL + e}`} alt='haha' />
            ))}
          </Carousel>
        </Card>
        <Card
          title={<h2 style={{ margin: 0 }}>Reviews</h2>}
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
        >
          {reviews.map((i, index) => (
            <Comment
              key={index}
              author={i.user.firstName + ' ' + i.user.lastName}
              datetime={new Date(i.createdAt).toUTCString()}
              avatar={<Avatar src='https://joeschmoe.io/api/v1/random' alt='Han Solo' />}
              content={
                <>
                  <Rate disabled defaultValue={i.rating} />
                  <p>{i.comment}</p>
                </>
              }
            />
          ))}
          <Comment
            avatar={<Avatar src='https://joeschmoe.io/api/v1/random' alt='Han Solo' />}
            content={
              <>
                <Rate onChange={(e) => setRating(e)} value={rating} />
                <Editor
                  onChange={(e) => setValue(e.target.value)}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              </>
            }
          />
        </Card>
      </Content>
      <ApplicationForm
            appValues={values}
            open={open}
            onCancel={() => {
              setOpen(false)
            }}
            onUpdate={() => {
              setOpen(false)
              onUpdate()
            }}
          />
    </Layout>
  )
}
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
        Add Review
      </Button>
    </Form.Item>
  </>
)
