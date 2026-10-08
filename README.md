# URL Shortener

A Node.js and Express URL-shortening service. It stores URLs in MongoDB, generates Base62 short codes, and uses Redis as a cache when resolving short links.

## Requirements

- Node.js and npm
- MongoDB
- Redis

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root and set the MongoDB connection string:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/url_shortener
   ```

3. Start MongoDB and Redis. Redis is configured to connect to `localhost:6379` in `src/config/redis.js`.

4. Start the server:

   ```sh
   node server.js
   ```

The Express server listens on port `4000` by default. Set `PORT` to change it.

## API

### Create a short URL

```http
POST /api/url/shorten
Content-Type: application/json
```

Request:

```json
{
  "originalUrl": "https://example.com/some/long/path"
}
```

Example using the default application port:

```sh
curl -X POST http://localhost:4000/api/url/shorten \
  -H 'Content-Type: application/json' \
  -d '{"originalUrl":"https://example.com/some/long/path"}'
```

The service responds with a JSON object containing `shortuRL`, for example:

```json
{
  "shortuRL": "http://localhost:8181/api/url/<code>"
}
```

### Follow a short URL

```http
GET /api/url/:code
```

Looks up the code and redirects to the original URL. The first lookup reads MongoDB and caches the URL in Redis; subsequent lookups can be served from the cache.

## Project layout

```text
server.js                 Application startup and service connections
src/
  app.js                  Express setup and route registration
  config/                 MongoDB and Redis connections
  controllers/            HTTP request handlers
  middlewares/            Error handling
  models/                 Mongoose models
  repositories/           URL persistence operations
  routes/                 API routes
  services/               URL shortening and lookup logic
  utils/base62.js         Short-code encoding
nginx.conf                Nginx reverse-proxy configuration
```

## Configuration notes

- The server defaults to port `4000`, but generated short URLs currently use port `8181`.
- `nginx.conf` listens on port `8080` and lists upstream servers on ports `8181` through `8185`. Align the generated URL and proxy upstreams with the ports where the application instances actually run before using Nginx.
- The package currently has no start or development script, and its `npm test` script is a placeholder that exits with an error. Start the application with `node server.js`.