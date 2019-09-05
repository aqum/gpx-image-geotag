import React, { Component, ChangeEvent } from 'react';
import * as piexifjs from 'piexifjs';
import './App.scss';

export class App extends Component {
  handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(piexifjs);
    const files = event.target.files;
    console.log(files);
    if (!files) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function() {
      const exifData = piexifjs.load(reader.result);
      console.log(
        'GPSLatitude',
        piexifjs.GPSHelper.dmsRationalToDeg(
          exifData.GPS[piexifjs.GPSIFD.GPSLatitude]
        )
      );
      console.log(
        'GPSLongitude',
        piexifjs.GPSHelper.dmsRationalToDeg(
          exifData.GPS[piexifjs.GPSIFD.GPSLongitude]
        )
      );
    };

    reader.readAsDataURL(files[0]);
  }

  render() {
    return (
      <div className="geotag">
        <section className="g-header">
          <h1 className="g-header__title">Geotag your photos</h1>
          <h3 className="g-header__subtitle">No upload needed</h3>
        </section>
        <section className="g-step">
          <h2 className="g-step__title">1. Choose GPX file</h2>
        </section>
        <section className="g-step">
          <h2 className="g-step__title">2. Choose .jpg photos</h2>
          <form>
            <input
              type="file"
              multiple
              onChange={this.handleImageChange}
              accept=".jpg,.jpeg"
            />
          </form>
        </section>
      </div>
    );
  }
}
