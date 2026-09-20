# Geolocation API Prototype

Minimal Node.js/Express API for receiving and validating geographic coordinates.

The project is intentionally small and is best understood as an **API prototype** rather than a production location-tracking platform.

## Core capabilities

- `POST /api/localizacao` for receiving coordinates;
- geographic range validation;
- configurable CORS policy;
- bounded in-memory storage;
- `GET /health` health check;
- payload-size protection;
- privacy-conscious logging that avoids printing precise coordinates.

## Technology stack

- Node.js 18+
- Express 5
- CORS middleware
- JSON/REST API

## Running locally

```bash
npm install
npm start
```

Default address:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## Example request

```bash
curl -X POST http://localhost:3000/api/localizacao \
  -H "Content-Type: application/json" \
  -d '{"latitude": -3.73, "longitude": -38.52}'
```

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3000` |
| `MAX_LOCATIONS` | Maximum records retained in memory | `1000` |
| `CORS_ORIGIN` | Comma-separated allowed origins | open in development |

Example:

```bash
CORS_ORIGIN=https://example.com,https://app.example.com npm start
```

## Architecture

```text
HTTP client
    │
    ▼
Express API
    │
    ├── CORS validation
    ├── JSON parsing
    ├── coordinate validation
    └── bounded in-memory storage
```

## Privacy and production considerations

Precise geolocation is sensitive information.

A production system should additionally implement:

- authenticated clients;
- HTTPS;
- persistent encrypted storage when retention is required;
- explicit retention/deletion rules;
- rate limiting;
- audit controls;
- consent and privacy requirements appropriate to the use case.

No precise coordinates are written to application logs by the current prototype.

---

**Portfolio classification:** API prototype · Node.js · Express · input validation · privacy-aware backend design
