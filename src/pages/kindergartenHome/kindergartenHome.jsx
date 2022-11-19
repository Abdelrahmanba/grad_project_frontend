import { Avatar, Button, Card, Comment, Layout, Rate, Statistic } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/apiCall'
import L from 'leaflet'

import './kindergartenHome.scss'
export default function KindergartenHome() {
  let { cid, kid } = useParams()
  const history = useHistory()
  const [kindergarten, setKindergarten] = useState({ imgs: [] })
  const token = useSelector((state) => state.user.token)
  const fetchK = async () => {
    const res = await get(`/kindergartens/${kid}`, token)
    if (res.ok) {
      const resJson = await res.json()
      setKindergarten(resJson)
      console.log(resJson)
    } else {
      history.push('/NotFound')
    }
  }
  useEffect(() => {
    fetchK()
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
            <div
              className='kbg'
              style={{
                backgroundImage: `url(${process.env.REACT_APP_API_URL + kindergarten.imgs[0]})`,
              }}
            />
          }
        >
          <Card.Meta
            title={<h2 style={{ margin: 0 }}>{kindergarten.name}</h2>}
            description={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Rate disabled defaultValue={2} />
                {kindergarten.locationFormatted}
              </div>
            }
          />
          <span>
            <Button type='primary' style={{ width: 180, height: 50 }}>
              Apply
            </Button>
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
          title={<h2 style={{ margin: 0 }}>Tuition</h2>}
        >
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='Per Term' value={93100} suffix='USD' />
          </Card.Grid>
          <Card.Grid hoverable={false} style={{ width: '50%', boxShadow: 'none' }}>
            <Statistic title='Financetial Aid' value={'Available'} />
          </Card.Grid>
        </Card>
        <Card
          title={<h2 style={{ margin: 0 }}>Reviews</h2>}
          className='kgp-card'
          hoverable={false}
          style={{ width: '100%', marginTop: 40 }}
        >
          <Comment
            author={"Han Solo"}
            avatar={<Avatar src='https://joeschmoe.io/api/v1/random' alt='Han Solo' />}
            content={
              <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes
                beautifully and efficiently.
              </p>
            }
          />
        </Card>
      </Content>
    </Layout>
  )
}
