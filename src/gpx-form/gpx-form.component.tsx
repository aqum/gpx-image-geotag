import React, { Component, ChangeEvent } from 'react';
import * as xmlParser from 'fast-xml-parser';

export class GpxForm extends Component {
  handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    // TODO: block next steps
    // TODO: store coordinates somewhere
    const files = event.target.files;
    if (!files) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function() {
      const jsonObj = xmlParser.parse(reader.result as string, {
        attributeNamePrefix: '',
        ignoreAttributes: false
      });
      console.log(jsonObj.gpx.trk.trkseg.trkpt);
    };

    reader.readAsText(files[0]);
  }

  render() {
    return (
      <form>
        <input type="file" onChange={this.handleFileChange} accept=".gpx" />
      </form>
    );
  }
}
