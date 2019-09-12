import { Component } from 'react';
import React from 'react';
import { FormImage } from '../images-form/images-form.component';
import * as piexifjs from 'piexifjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface GeotagDownloadProps {
  images: FormImage[];
}

interface ExpandedBlob {
  blob: Blob;
  fileName: string;
}

export class GeotagDownload extends Component<GeotagDownloadProps> {
  constructor(props) {
    super(props);

    this.handleDownload = this.handleDownload.bind(this);
  }

  async handleDownload() {
    const zip = new JSZip();

    for (const image of this.props.images) {
      const blob = await GeotagDownload.createBlobWithGps(image);
      zip.file(blob.fileName, blob.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'geotagged-photos.zip');
  }

  static async createBlobWithGps(image: FormImage): Promise<ExpandedBlob> {
    const exifData = piexifjs.load(image.originalDataUrl);
    if (image.gps) {
      exifData.GPS[
        piexifjs.GPSIFD.GPSLatitude
      ] = piexifjs.GPSHelper.degToDmsRational(image.gps.lat);
      exifData.GPS[
        piexifjs.GPSIFD.GPSLongitude
      ] = piexifjs.GPSHelper.degToDmsRational(image.gps.lon);
    }

    const exifStr = piexifjs.dump(exifData);
    const updatedDataUrl = piexifjs.insert(exifStr, image.originalDataUrl);
    const updatedBlob = await fetch(updatedDataUrl).then(res => res.blob());

    return {
      blob: updatedBlob,
      fileName: image.name
    };
  }

  render() {
    return (
      <div className="geotag-download">
        <button onClick={this.handleDownload}>Download</button>
      </div>
    );
  }
}
