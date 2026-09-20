const express = require('express');
const cors = require('cors');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const MAX_LOCATIONS = Number(process.env.MAX_LOCATIONS) || 1000;

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header are commonly local/server-to-server.
      // When CORS_ORIGIN is not configured, development access remains open.
      if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS policy'));
    },
  }),
);

app.use(express.json({ limit: '16kb' }));

// Ephemeral in-memory storage. This is intentionally not a production database.
const locations = [];

const isValidCoordinate = (latitude, longitude) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  longitude >= -180 &&
  longitude <= 180;

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    storedLocations: locations.length,
  });
});

app.get('/', (_req, res) => {
  res.send('Location API is running.');
});

app.post('/api/localizacao', (req, res) => {
  const latitude = Number(req.body?.latitude);
  const longitude = Number(req.body?.longitude);
  const requestedTimestamp = req.body?.timestamp;

  if (!isValidCoordinate(latitude, longitude)) {
    return res.status(400).json({
      message: 'Latitude or longitude is invalid.',
    });
  }

  const timestamp =
    requestedTimestamp === undefined || requestedTimestamp === null
      ? Date.now()
      : requestedTimestamp;

  locations.push({ latitude, longitude, timestamp });

  if (locations.length > MAX_LOCATIONS) {
    locations.splice(0, locations.length - MAX_LOCATIONS);
  }

  // Do not log precise coordinates: geolocation data may be sensitive.
  console.log('Location record received.');

  return res.status(201).json({
    message: 'Location received successfully.',
  });
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Location API listening on port ${PORT}`);
});
