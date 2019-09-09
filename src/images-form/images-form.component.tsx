import React, { Component, ChangeEvent } from 'react';
import * as piexifjs from 'piexifjs';

export class ImagesForm extends Component {
  handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    // TODO: handle files without coordinates
    // TODO: show thumbnails (above map or already on map) - don't override GPS already without confirmation
    // TODO: handle file result
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
      <form>
        <input
          type="file"
          multiple
          onChange={this.handleImageChange}
          accept=".jpg,.jpeg"
        />
      </form>
    );
  }
}
