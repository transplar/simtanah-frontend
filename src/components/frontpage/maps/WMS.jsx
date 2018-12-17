import React from 'react'
import L from 'leaflet'
import wms from 'leaflet.wms'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import LayerList from './LayerList'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
  },
})

class WMS extends React.Component {
  sourceURL = `http://${document.location.hostname}:9090/geoserver/ows?`
  capabilitiesConfig = {
    request: 'GetCapabilities',
    service: 'WMS',
    version: '1.3.0'
  }
  wmsConfig = {
    format: 'image/png',
    tiled: true,
    transparent: true,
    version: '1.3.0',
    info_format: 'text/html',
    feature_count: 100
  }

  constructor (props) {
    super(props)

    this.state = {
      layers: [],
      info: '',
      error: '',
    }
  }

  componentDidMount () {
    this.initWMSSource()
    let layers = this.getAvailableLayer()
    layers.then(res => {
      this.setState({
        layers: res
      })
    })
  }

  initWMSSource = () => {
    wms.Source = wms.Source.extend({
      'showFeatureInfo': (latlng, info) => {
        this.setState({
          info: {
            latlng: latlng,
            content: info
          }
        })
        let popup = L.popup()
          .setLatLng(latlng)
          .setContent(this.popupSummary(info))
          .openOn(this.props.map)
        this.props.map.openPopup(popup)
      }
    })

    this.wmsSource = wms.source(this.sourceURL, this.wmsConfig)
  }

  getAvailableLayer = () => {
    return new Promise((resolve, reject) => {
      const capabilitiesParams = Object.entries(this.capabilitiesConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      fetch([this.sourceURL, capabilitiesParams].join('&'))
        .then(responnse => responnse.text())
        .then(text => {
          let xml = new DOMParser().parseFromString(text, 'text/xml')
          let layer = [...xml.querySelectorAll('Layer[queryable]')]
            .map(item => {
              let legendGraphic
              const name = item.querySelector('Name').textContent
              const title = item.querySelector('Title').textContent
              try {
                legendGraphic = `${item.querySelector('LegendURL OnlineResource')
                  .getAttribute('xlink:href')}&LEGEND_OPTIONS=forceLabels:on`
              } catch(error) {
                legendGraphic = `${this.wmsSource._url}
                  &SERVICE=WMS
                  &REQUEST=GetLegendGraphic
                  &FORMAT=image/png
                  &LEGEND_OPTIONS=forceLabels:on
                  &LAYER=${name}`
                console.log(legendGraphic)
              }
              return {
                name: name,
                title: title,
                legendGraphic: legendGraphic
              }
            })
            this.setState({error: ''})
          resolve(layer)
        })
        .catch(error => {
          this.setState({error: 'Gagal terhubung ke Geoserver'})
          reject(error)
        })
    })
  }

  popupSummary = (html) => {
    html = new DOMParser().parseFromString(html, 'text/html')
    let layerCount = [...html.querySelectorAll('table')].length
    let objectCount = [...html.querySelectorAll('table tr')]
      .filter(item => item.querySelector(':not(th)'))
      .length
    let summary = `${layerCount} Layer, ${objectCount} Objek`
    return summary
  }

  render () {
    const { classes } = this.props

    return (
      <Grid container className={classes.root}>
        <Grid item md={6}>
          <LayerList
            layers={this.state.layers}
            wmsSource={this.wmsSource}
            map={this.props.map}
            error={this.state.error}
            />
        </Grid>
        <Grid item md={6}>
          <span dangerouslySetInnerHTML={{__html: this.state.info.content}} />
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(WMS)