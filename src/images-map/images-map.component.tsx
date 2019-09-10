import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './images-map.component.scss';
import 'leaflet/dist/leaflet.css';
import { FormImage } from '../images-form/images-form.component';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export interface ImagesMapProps {
  images: FormImage[];
}

export class ImagesMap extends Component<ImagesMapProps> {
  render() {
    console.log(this.props.images);
    const position = [51.505, -0.09];
    return (
      <div className="images-map">
        <Map center={position} zoom={3}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.props.images
            .filter(image => image.gps)
            .map(image => {
              console.log(image.gps && [image.gps.lat, image.gps.lon]);
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
