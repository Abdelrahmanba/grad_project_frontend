import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import { AutoComplete, Input } from 'antd'
import { useState, useEffect, useRef, useMemo } from 'react'
import opencage from 'opencage-api-client'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default function Map({ onChange }) {
  const [label, setLabel] = useState('Please Select On The Map')
  const [address, setLocAddress] = useState('')
  const [options, setOptions] = useState([])
  const [position, setPosition] = useState([32.22111, 35.25444])
  const result = {
    latitude: '0',
    longitude: '0',
    locationFormatted: '',
    country: '',
    city: '',
  }

  const geocode = async (address) => {
    try {
      const res = await opencage.geocode({
        key: 'dfbc15eb0c4f47238c36aa6ae7072741',
        q: address,
      })
      setOptions(
        res.results.map((result, i) => ({
          ...result,
          value: result.formatted,
          key: i,
        }))
      )
      result.locationFormatted = res.results[0].formatted
      result.city = res.results[0].components.city
      result.country = res.results[0].components.country

      onChange(result)
      setLabel(res.results[0].formatted)
    } catch (er) {
      console.log(er)
    }
  }

  function DraggableMarker() {
    const markerRef = useRef(null)
    const map = useMap()


    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
            result.latitude = marker.getLatLng().lat
            result.longitude = marker.getLatLng().lng
            onChange(result)

            return geocode(marker.getLatLng().lat + '%2C' + marker.getLatLng().lng)
          }
        },
      }),
      []
    )

    useEffect(() => {
      map.setView(position)
    }, [position])

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={L.icon({
          iconSize: [25, 41],
          iconAnchor: [10, 41],
          popupAnchor: [2, -40],
          iconUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
        })}
      />
    )
  }
  return (
    <>
      <h3 style={{ marginBottom: 20, marginTop: 5 }}>{label}</h3>
      <AutoComplete
        onChange={(e) => {
          setLocAddress(e)
          if (e.length > 4) geocode(e)
        }}
        options={options}
        style={{ zIndex: 99 }}
        onSelect={(data, o) => {
          setPosition([o.geometry.lat, o.geometry.lng])
        }}
      >
        <Input.Search size='large' placeholder='City, State or Country ' />
      </AutoComplete>
      <MapContainer center={position} zoom={10} scrollWheelZoom={true} style={{ height: 400 }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <DraggableMarker />
      </MapContainer>
    </>
  )
}
