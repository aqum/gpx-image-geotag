import React, { Component } from 'react';
import './app.component.scss';
import { GpxForm, GpxPoint } from './gpx-form/gpx-form.component';
import { ImagesForm, FormImage } from './images-form/images-form.component';
import { GeotagDownload } from './geotag-download/geotag-download.component';
import { CorrelateStep } from './correlate-step/correlate-step.component';

interface AppState {
  images: FormImage[];
  points: GpxPoint[];
  offsetSecs: number;
}

export class App extends Component<{}, AppState> {
  static maxGpsTimeframeSecs = 15 * 60;

  constructor(props) {
    super(props);

    this.handleImagesChange = this.handleImagesChange.bind(this);
    this.handleGpxChange = this.handleGpxChange.bind(this);
    this.handleOffsetChange = this.handleOffsetChange.bind(this);

    this.state = {
      images: [],
      points: [],
      offsetSecs: 0
    };
  }

  handleImagesChange(images: FormImage[]) {
    this.setState({
      images: images
    });
    this.updateImagesLocation();
  }

  handleGpxChange(points: GpxPoint[]) {
    this.setState({
      points
    });
    this.updateImagesLocation();
  }

  updateImagesLocation() {
    const imagesWithGpx = this.state.images.map(image =>
      App.attachGpsCoordinates(image, this.state.points, this.state.offsetSecs)
    );

    this.setState({
      images: imagesWithGpx
    });
  }

  handleOffsetChange(offsetSecs: number): void {
    this.setState({
      offsetSecs
    });

    this.updateImagesLocation();
  }

  static attachGpsCoordinates(
    image: FormImage,
    points: GpxPoint[],
    offsetSecs: number = 0
  ): FormImage {
    // IMPROVEMENT: consider updating algorithm to find midpoint (points can be far apart if travelling fast)
    const lastModifiedWithOffset = new Date(
      image.lastModified.getTime() + offsetSecs * 1000
    );

    // IMPROVEMENT: check if points are always sorted from oldest (in GPX spec) and consider breaking loop early
    const timeframeSortedPoints = [...points].sort((pointA, pointB) => {
      const timeframeSecsA = calculateTimeframeSecs(pointA);
      const timeframeSecsB = calculateTimeframeSecs(pointB);
      return timeframeSecsA - timeframeSecsB;
    });

    const closestPoint =
      timeframeSortedPoints[0] &&
      calculateTimeframeSecs(timeframeSortedPoints[0]) <=
        App.maxGpsTimeframeSecs
        ? timeframeSortedPoints[0]
        : undefined;

    if (!closestPoint) {
      return image;
    }

    return {
      ...image,
      gps: {
        lat: closestPoint.lat,
        lon: closestPoint.lon
      }
    };

    function calculateTimeframeSecs(point: GpxPoint): number {
      return (
        Math.abs(point.time.getTime() - lastModifiedWithOffset.getTime()) / 1000
      );
    }
  }

  render() {
    return (
      <div className="geotag">
        <section className="g-header">
          <h1 className="g-header__title">Geotag your photos</h1>
          <h3 className="g-header__subtitle">No upload needed</h3>
        </section>

        <div className="geotag__steps">
          <section className="g-step">
            <h2 className="g-step__title">Select GPX file</h2>
            <GpxForm onChange={this.handleGpxChange} />
          </section>

          <section className="g-step">
            <h2 className="g-step__title">Pick .jpg photos</h2>
            <ImagesForm onImagesChange={this.handleImagesChange} />
          </section>

          <CorrelateStep
            images={this.state.images}
            points={this.state.points}
            onOffsetChange={this.handleOffsetChange}
          />

          <section className="g-step">
            <h2 className="g-step__title">Finish</h2>
            <GeotagDownload images={this.state.images} />
          </section>

          <section className="g-step">
            <h2 className="g-step__title">Read more</h2>

            <h4>About project</h4>
            <p>
              This is side-project that I built because I couldn't find good
              enough solution to geotag my photos. It doesn't require any
              upload. Images are processed inside your browser.
            </p>
            <p>
              If you find it useful or the exact opposite - it doesn't work for
              you - let me know (see author section).
            </p>
            <p>
              Code is open sourced so feel free to inspect it or contribute on{' '}
              <a href="https://github.com/aqum/gpx-image-geotag">Github</a>
            </p>

            <h4>What is GPX file?</h4>
            <p>
              GPX file is basically collection of coordinates and timestamps. Is
              is structurized using XML tags so computer can parse it more
              easily. You can open it in text editor and see for yourself.
            </p>
            <p>Here is sample line from GPX file:</p>
            <code>
              <pre>
                {`<trkpt lat="50.8761400" lon="15.1888720">
  <ele>377.5</ele>
  <time>2019-08-17T09:49:06Z</time>
</trkpt>`}
              </pre>
            </code>

            <h4>How it works?</h4>
            <p>
              Your photo has creation date. Based on this we can look for
              closest timestamp in GPX file. Then we take coordinates and write
              them to jpeg metadata known also as{' '}
              <a href="https://pl.wikipedia.org/wiki/Exchangeable_Image_File_Format">
                Exif
              </a>
              .
            </p>
            <p>
              Of course you can do it yourself but with this app it is much
              faster. Isn't it? ;)
            </p>

            <h4>Author</h4>
            <p>
              My name is Adam Florczak. I'm based in Warsaw (Poland) and I do
              programming for a living.
            </p>
            <p>
              Here is blog (in Polish) about my trips:{' '}
              <a href="https://rowerotopia.pl">rowerotopia.pl</a>
            </p>
            <p>My email: adam.florczak [at] me.com</p>
            <p>
              <a href="https://www.linkedin.com/in/adam-florczak-4379b692/">
                Linkedin
              </a>
            </p>
          </section>
        </div>
      </div>
    );
  }
}
