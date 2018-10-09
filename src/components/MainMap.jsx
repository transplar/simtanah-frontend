import React from 'react'
import L from 'leaflet'
import { Map, GeoJSON, TileLayer, Marker, Popup } from 'react-leaflet'
import { Container } from 'reactstrap'
import tableify from 'tableify'
import 'leaflet/dist/leaflet.css'
import './MainMap.css'
import geojsonData from '../data/example.json'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default class MainMap extends React.Component {
  state = {
    lat: -6.933927,
    lng: 107.662110,
    zoom: 8
  }

  onEachFeature = (feature, layer) => {
    layer.on({
      click: (event) => {
        let info = this.refs.info.leafletElement
        let map = this.refs.map.leafletElement
        info.setContent(tableify(feature.properties))
        info.setLatLng(event.latlng)
          .openOn(map)
      }
    })
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.refs.map.leafletElement.closePopup()
    }, 10)
  }

  render () {
    const position = [this.state.lat, this.state.lng]

    return (
      <Container className='bg-white my-1 py-1 rounded'>
        <Map center={position} zoom={this.state.zoom} ref='map'>
          <TileLayer
            attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <GeoJSON
            data={geojsonData}
            onEachFeature={this.onEachFeature} />
          <Marker position={position}>
            <Popup>
              <p className='text-center'>
                Dinas Perumahan Dan Permukiman<br />Provinsi Jawa Barat
              </p>
            </Popup>
          </Marker>
          <Popup position={position} ref='info'></Popup>
        </Map>
      </Container>
    )
  }
}