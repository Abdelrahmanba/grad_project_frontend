import { ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Card, Modal, Pagination, Skeleton, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteCall, get } from '../../utils/apiCall'
import ApplicationForm from '../applicationForm/applicationForm'
import { imgs } from '../../utils/kindergartenImgs'
import moment from 'moment'
import EditKindergartenForm from '../editKindergaren/editKindergarten'

const { confirm } = Modal

export default function KinderGartenCards({
  newKindergarten,
  children,
  appliable,
  url,
  childId,
  matching,
  appliedS = [],
  onUpdate = () => {},
}) {
  const token = useSelector((state) => state.user.token)
  const [values, setValues] = useState({})
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)

  const history = useHistory()
  const [page, setPage] = useState(1)
  const onPageChange = async (page) => {
    setLoading(true)
    setPage(page)
    const res = await get(
      `/kindergartens?pageNumber=${page}&pageSize=200&includeImages=true`,
      token
    )
    if (res.ok) {
      const resJson = await res.json()
      setKindergartens(resJson.rows)
    }
    setLoading(false)
  }
  const fetchKindergartens = async () => {
    setLoading(true)
    const res = await get(url, token)
    if (res.ok) {
      const resJson = await res.json()
      setKindergartens(resJson.rows)
      setCount(resJson.count)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchKindergartens()
  }, [url])

  useEffect(() => {
    setKindergartens((kindergartens) => [...kindergartens, newKindergarten])
  }, [newKindergarten])

  const [kindergartens, setKindergartens] = useState([])
  const [loading, setLoading] = useState(true)
  const showApply = (e) => {
    const semesterId = e.currentTarget.getAttribute('value')
    setValues({ childId, semesterId })
    setOpen(true)
  }
  const showConfirm = async (e) => {
    const id = e.currentTarget.getAttribute('value')
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        setLoading(true)
        await deleteCall('/RegisterApplication/' + id, token)
        onUpdate()
        setLoading(false)
      },
    })
  }
  const showEdit = (e) => {
    const index = e.currentTarget.getAttribute('value')
    const defaults = (({ email, name, phone, website, id, latitude,longitude}) => ({email, name, phone, website, id,longitude,latitude}))(kindergartens[index])
    setValues(defaults)
    setOpen2(true)
  }
  if (loading) {
    return (
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton loading={loading} active>
          <Card.Meta title='Card title' description='This is the description' />
        </Skeleton>
      </Card>
    )
  }else if (kindergartens.length==0){
    return<h2>No Results Found.</h2>
  }
   else {
    return (
      <>
        <Space size={'large'} wrap>
          {kindergartens.map((kindergarten, index) => {
            let i = -1
            const app = appliable && kindergarten.runningSemester
            if (app) {
              i = appliedS.map((e) => e.semesterId).indexOf(kindergarten.runningSemester.id)
            }
            return (
              <Card
                className='card'
                style={{ width: 300, marginTop: 16, minHeight: 365 }}
                hoverable
                key={index}
                headStyle={{margin:"auto"}}
                extra={appliable?"":
                
                <EditOutlined
                style={{ margin: 'auto auto' }}
                key='edit'
                value={index}
                onClick={showEdit}
              />
            }
                actions={
                  app
                    ? [
                        i !== -1 ? (
                          <Button
                            value={appliedS[i].id}
                            type='primary'
                            onClick={showConfirm}
                            block
                            style={{ height: '50px', backgroundColor: '#4e5565', border: 0 }}
                          >
                            withdraw
                          </Button>
                        ) : (
                          <Button
                            value={kindergarten.runningSemester.id}
                            type='primary'
                            onClick={showApply}
                            block
                            style={{ height: '50px', border: '0' }}
                          >
                            Apply
                          </Button>
                        ),
                      ]
                    :  ""
                }
                cover={
                  kindergarten.imgs[0] ? (
                    <div
                      onClick={() =>
                        appliable
                          ? history.push('/child/' + childId + '/kindergarten/' + kindergarten.id)
                          : history.push('/kindergarten/' + kindergarten.id)
                      }
                      alt='example'
                      className='cover'
                      style={{
                        backgroundImage: `url(
                      ${process.env.REACT_APP_API_URL + kindergarten.imgs[0]}
                    )`,
                      }}
                    />
                  ) : (
                    <div
                      onClick={() =>
                        appliable
                          ? history.push('/child/' + childId + '/kindergarten/' + kindergarten.id)
                          : history.push('/kindergarten/' + kindergarten.id)
                      }
                      alt='example'
                      className='cover'
                      style={{
                        backgroundImage: `url(
                    ${imgs[index % 9]}
                  )`,
                      }}
                    />
                  )
                }
              >
                <Skeleton loading={loading} avatar active>
                  <Card.Meta title={kindergarten.name} />
                </Skeleton>
                <Space direction='vertical'>
                  <h4 style={{ color: 'gray', marginTop: 5 }}>
                    {kindergarten.runningSemester
                      ? 'Start Date:' + kindergarten.runningSemester.startDate
                      : ''}
                  </h4>
                  <h4 style={{ color: 'gray' }}>
                    {kindergarten.runningSemester
                      ? 'Tuition: ' + kindergarten.runningSemester.tuition + '$'
                      : ''}
                  </h4>
                </Space>
              </Card>
            )
          })}

          {children}
          <EditKindergartenForm 
           open={open2}
          defaultValues={values}
          onCreate={()=>{setOpen2(false);
          onPageChange(1)
          }}
          onCancel={() => {
            setOpen2(false)
          }}/>
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
        </Space>
        <Pagination
          onChange={onPageChange}
          defaultCurrent={1}
          total={count}
          current={page}
          style={{ marginTop: '30px' }}
        />
      </>
    )
  }
}
