import React, { Component, ChangeEvent } from 'react';
import * as piexifjs from 'piexifjs';

export interface FormImage {
  thumbnailUrl: string;
  name: string;
  gps?: {
    lat: number;
    lon: number;
  };
}

interface StaticImageFile {
  dataUrl: string;
  name: string;
}

interface ImagesFormProps {
  onImagesChange?: (images: FormImage[]) => void;
}

export class ImagesForm extends Component<ImagesFormProps> {
  constructor(props) {
    super(props);

    this.handleImageChange = this.handleImageChange.bind(this);
  }

  async handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const imageFilesPromises = Array.from(files).map(file =>
      ImagesForm.convertFileToDataUrl(file)
    );
    const imageFiles = await Promise.all(imageFilesPromises);

    const images: FormImage[] = imageFiles.map(imageFile => {
      const result: FormImage = {
        // TODO: rescale image because operating big thumbnails is cpu/ram intensive
        thumbnailUrl: imageFile.dataUrl,
        name: imageFile.name
      };

      const exifData = piexifjs.load(imageFile.dataUrl);
      const latDms = exifData.GPS[piexifjs.GPSIFD.GPSLatitude];
      const lonDms = exifData.GPS[piexifjs.GPSIFD.GPSLongitude];
      if (latDms && lonDms) {
        const lat = piexifjs.GPSHelper.dmsRationalToDeg(latDms);
        const lon = piexifjs.GPSHelper.dmsRationalToDeg(lonDms);

        result.gps = {
          lat,
          lon
        };
      }

      return result;
    });

    if (this.props.onImagesChange) {
      this.props.onImagesChange(images);
    }
  }

  static convertFileToDataUrl(file: File): Promise<StaticImageFile> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = event => {
        const result = event.target && event.target['result'];
        if (!result) {
          reject('convertFileToDataUrl: empty file');
        }

        resolve({
          dataUrl: (result as string) || '',
          name: file.name
        });
      };

      reader.onerror = () => reject('convertFileToDataUrl: unknown error');
      reader.onabort = () => reject('convertFileToDataUrl: abort');

      reader.readAsDataURL(file);
    });
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