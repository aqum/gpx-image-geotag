import React, { Component } from 'react';
import './app.component.scss';
import { GpxForm } from './gpx-form/gpx-form.component';
import { ImagesForm } from './images-form/images-form.component';
import { ImagesMap } from './images-map/images-map.component';

export class App extends Component {
  render() {
    return (
      <div className="geotag">
        <section className="g-header">
          <h1 className="g-header__title">Geotag your photos</h1>
          <h3 className="g-header__subtitle">No upload needed</h3>
        </section>

        <section className="g-step">
          <h2 className="g-step__title">1. Choose GPX file</h2>
          <GpxForm />
        </section>

        <section className="g-step">
          <h2 className="g-step__title">2. Choose .jpg photos</h2>
          <ImagesForm />
        </section>

        <section className="g-step">
          <h2 className="g-step__title">3. Corelate time</h2>
          <ImagesMap />
        </section>
      </div>
    );
  }
}
