# gpx-jpg geotag

Webapp for geotagging JPG photos using GPX file. Doesn't require server upload. Pick your files, see photos on map, adjust offset and download zip archive.

### How it works?
GPX file is basically collection of coordinates and timestamps. Is is structurized using XML tags so computer can parse it more easily. You can open it in text editor and see for yourself.

Here is sample line from GPX file:
```
<trkpt lat="50.8761400" lon="15.1888720">
  <ele>377.5</ele>
  <time>2019-08-17T09:49:06Z</time>
</trkpt>
```

### Run app locally
`npm install` & `npm start`

### Build & deploy on github pages
`npm run deploy`

### Tests
`npm test`
