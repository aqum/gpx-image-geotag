import React, { Component } from 'react';
import { OffsetControl } from './offset-control/offset-control.component';
import { ImagesMap } from './images-map/images-map.component';
import { FormImage } from '../images-form/images-form.component';
import { GpxPoint } from '../gpx-form/gpx-form.component';
import './correlate-step.component.scss';
import { MessageBox } from '../message-box/message-box.component';

export interface CorrelateStepProps {
  images: FormImage[];
  points: GpxPoint[];
  onOffsetChange: (offsetSecs: number) => void;
}

export class CorrelateStep extends Component<CorrelateStepProps> {
  render() {
    const imagesOutsideRange = this.props.images.filter(image => !image.gps);
    return (
      <section className="g-step">
        <h2 className="g-step__title">Corelate time</h2>
        <OffsetControl onChange={this.props.onOffsetChange} />
        <ImagesMap images={this.props.images} points={this.props.points} />

        {imagesOutsideRange.length > 0 && (
          <div className="outside-range">
            <h3 className="outside-range__title">
              Images with dates outside GPX range
            </h3>
            <div className="outside-range__list">
              {imagesOutsideRange.map(image => (
                <img
                  className="outside-range__image"
                  src={image.thumbnailUrl}
                  width="50"
                  alt={image.name}
                  title={image.name}
                  key={image.name}
                />
              ))}
            </div>
          </div>
        )}

        <MessageBox text="Your GPX recorder (f.e. phone) and your camera might not share the same time. Check your photos and update offset if necessary." />
      </section>
    );
  }
}
