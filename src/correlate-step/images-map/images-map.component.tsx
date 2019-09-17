import React, { Component } from 'react';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  LatLngBounds
} from 'react-leaflet';
import './images-map.component.scss';
import 'leaflet/dist/leaflet.css';
import { FormImage } from '../../images-form/images-form.component';
import L from 'leaflet';
import { GpxPoint } from '../../gpx-form/gpx-form.component';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export interface ImagesMapProps {
  images: FormImage[];
  points: GpxPoint[];
}

export class ImagesMap extends Component<ImagesMapProps> {
  render() {
    const linePoints = this.props.points.map(point => [point.lat, point.lon]);
    let bounds: LatLngBounds = [[0, 0], [75, 180]];
    if (linePoints.length > 1) {
      bounds = [linePoints[0], linePoints[linePoints.length - 1]];
    }

    return (
      <div className="images-map">
        <Map bounds={bounds}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={linePoints} />
          {this.props.images
            .filter(image => image.gps)
            .map(image => {
              return (
                <Marker
                  position={image.gps && [image.gps.lat, image.gps.lon]}
                  key={image.name}
                >
                  <Popup>
                    <img src={image.thumbnailUrl} width="50" alt={image.name} />
                    <br />
                    {image.name}
                  </Popup>
                </Marker>
              );
            })}
        </Map>
      </div>
    );
  }
}
