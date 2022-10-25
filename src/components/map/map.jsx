import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { AutoComplete } from 'antd'
import { useState, useEffect } from 'react'
import opencage from 'opencage-api-client'

export default function Map() {
  const [address, setAddress] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (address.length < 4) {
      return
    }
    const geocode = async () => {
      try {
        const res = await opencage.geocode({ key: 'dfbc15eb0c4f47238c36aa6ae7072741', q: address })
        setOptions(res.results.map((result) => ({ value: result.formatted,...result })))
      } catch (er) {
        console.log(er)
      }
    }
    geocode()
  }, [address])

  return (
    <>
      <AutoComplete onChange={(e) => setAddress(e)} options={options} />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: 400 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </>
  )
}
