import React, { Component, ChangeEvent } from 'react';
import * as piexifjs from 'piexifjs';
import { MessageBox } from '../message-box/message-box.component';
import './images-form.component.scss';

export interface FormImage {
  thumbnailUrl: string;
  name: string;
  lastModified: Date;
  gps?: {
    lat: number;
    lon: number;
  };
  originalDataUrl: string;
}

interface StaticImageFile {
  dataUrl: string;
  name: string;
  lastModified: Date;
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

    const imagesPromises: Promise<FormImage>[] = imageFiles.map(
      async imageFile => {
        const result: FormImage = {
          thumbnailUrl: await ImagesForm.resizeImage(
            imageFile.dataUrl,
            200,
            200
          ),
          name: imageFile.name,
          lastModified: imageFile.lastModified,
          originalDataUrl: imageFile.dataUrl
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
      }
    );
    const images = await Promise.all(imagesPromises);

    if (this.props.onImagesChange) {
      this.props.onImagesChange(images);
    }
  }

  static async resizeImage(
    url: string,
    maxWidth: number,
    maxHeight: number
  ): Promise<string> {
    const sourceImage = new Image();

    return new Promise((resolve, reject) => {
      sourceImage.onload = () => {
        const proportionRatio =
          sourceImage.width > sourceImage.height
            ? maxWidth / sourceImage.width
            : maxHeight / sourceImage.height;
        const proportionalWidth = sourceImage.width * proportionRatio;
        const proportionalHeight = sourceImage.height * proportionRatio;

        // Create a canvas with the desired dimensions
        var canvas = document.createElement('canvas');
        canvas.width = proportionalWidth;
        canvas.height = proportionalHeight;

        // Scale and draw the source image to the canvas
        const context = canvas.getContext('2d');
        if (!context) {
          reject('resizeImage: context is null');
          return;
        }
        context.drawImage(sourceImage, 0, 0, proportionalWidth, proportionalHeight);

        // Convert the canvas to a data URL in PNG format
        resolve(canvas.toDataURL());
      };
      sourceImage.onerror = () => reject('resizeImage: unknown error');
      sourceImage.onabort = () => reject('resizeImage: abort');

      sourceImage.src = url;
    });
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
          name: file.name,
          lastModified: new Date(file.lastModified)
        });
      };

      reader.onerror = () => reject('convertFileToDataUrl: unknown error');
      reader.onabort = () => reject('convertFileToDataUrl: abort');

      reader.readAsDataURL(file);
    });
  }

  render() {
    return (
      <form className="images-form">
        <input
          className="images-form__input"
          type="file"
          multiple
          onChange={this.handleImageChange}
          accept=".jpg,.jpeg"
        />

        <MessageBox
          text={
            'There are no limits in number of images but if yours are large and you have many of them it may take more time to load.'
          }
        />
        <MessageBox
          text={
            'It is better not to mix photos from different cameras. Their internal clock might not be synchronized. See "How it works" below for additional information.'
          }
        />
        <MessageBox
          text={
            'You can choose photos files before GPX file to see photos with existing GPS data on map.'
          }
        />
      </form>
    );
  }
}
