import { FormImage } from './images-form/images-form.component';
import { GpxPoint } from './gpx-form/gpx-form.component';
import { App } from './app.component';

describe('AppComponent', () => {
  describe('attachGpsCoordinates', () => {
    const sampleImage: FormImage = {
      lastModified: new Date('2019-09-24T08:51:30.722Z'),
      thumbnailUrl: '',
      name: 'sample.jpg',
      originalDataUrl: ''
    };

    it('Correlates GPS coordinates with exact time as image using offset', () => {
      const gpsPoints: GpxPoint[] = [
        {
          lat: 52.138049,
          lon: 20.918532,
          ele: 100,
          time: new Date('2019-09-24T08:50:30.722Z')
        },
        {
          lat: 52.237049,
          lon: 21.017532,
          ele: 100,
          time: new Date('2019-09-24T08:50:59.722Z')
        },
        {
          lat: 52.339049,
          lon: 21.119532,
          ele: 100,
          time: new Date('2019-09-24T08:51:30.722Z')
        },
        {
          lat: 52.339049,
          lon: 21.139532,
          ele: 100,
          time: new Date('2019-09-24T08:52:30.722Z')
        }
      ];

      const imageWithGPS: FormImage = App.attachGpsCoordinates(
        sampleImage,
        gpsPoints,
        60
      );

      expect(imageWithGPS.gps).toEqual({
        lat: 52.339049,
        lon: 21.139532
      });
    });

    it('Does nothing when no points within given timeframe', () => {
      const gpsPointsWithDayDifference: GpxPoint[] = [
        {
          lat: 52.138049,
          lon: 20.918532,
          ele: 100,
          time: new Date('2019-09-23T07:51:30.722Z')
        },
        {
          lat: 52.237049,
          lon: 21.017532,
          ele: 100,
          time: new Date('2019-09-24T06:51:30.722Z')
        },
        {
          lat: 52.339049,
          lon: 21.119532,
          ele: 100,
          time: new Date('2019-09-25T09:51:30.722Z')
        }
      ];

      const imageWithGPS: FormImage = App.attachGpsCoordinates(
        sampleImage,
        gpsPointsWithDayDifference
      );

      expect(imageWithGPS.gps).toEqual(undefined);
    });
  });
});
