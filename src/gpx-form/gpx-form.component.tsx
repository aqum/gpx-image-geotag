import React, { Component, ChangeEvent } from 'react';
import * as xmlParser from 'fast-xml-parser';

export interface GpxFormProps {
  onChange?: (gpxPoints: GpxPoint[]) => void;
}

export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number;
  time: Date;
}

interface GpxRawPoint {
  lat: string;
  lon: string;
  ele: number;
  time: string;
}

export class GpxForm extends Component<GpxFormProps> {
  constructor(props) {
    super(props);

    this.handleFileChange = this.handleFileChange.bind(this);
  }

  async handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const points = await GpxForm.convertFileToGpxPoints(files[0]);

    if (this.props.onChange) {
      this.props.onChange(points);
    }
  }

  static convertFileToGpxPoints(file: File): Promise<GpxPoint[]> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = event => {
        const result = event.target && event.target['result'];
        if (!result) {
          reject('convertFileToGpxPoints: empty file');
        }

        const jsonObj = xmlParser.parse(reader.result as string, {
          attributeNamePrefix: '',
          ignoreAttributes: false
        });

        const rawPoints = jsonObj.gpx.trk.trkseg.trkpt as GpxRawPoint[];
        const points = rawPoints.map(rawPoint => ({
          lat: parseFloat(rawPoint.lat),
          lon: parseFloat(rawPoint.lon),
          ele: rawPoint.ele,
          time: new Date(rawPoint.time)
        }));

        resolve(points);
      };

      reader.onerror = () => reject('convertFileToGpxPoints: unknown error');
      reader.onabort = () => reject('convertFileToGpxPoints: abort');

      reader.readAsText(file);
    });
  }

  render() {
    return (
      <form>
        <input type="file" onChange={this.handleFileChange} accept=".gpx" />
      </form>
    );
  }
}
