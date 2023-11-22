# Cinema Nest App

## Description

This API provides functionality for booking tickets for different movies in the cinema. API provides CRUD endpoints for actors, country, genres, movies, reviews, seats, sessions and tickets. Also this API has authorization endpoints, including google, facebook and github OAuth. Authorized endpoints include refresh endpoint, avatar image uploading, person and ticket methods. You can upload corresponding files to avatar, poster and trailer endpoints. Trailer endpoint accepts both trailer and its preview image. Movie and ticket endpoints gives you opportunity to choose preferable language from supported languages for get methods. Seat also has an endpoint to generate default seats for session with specified price. This can save your time because you don't need to create all seats individually, but if you want there is also an endpoint for creating seats separately as well.

## Deployed app

https://modsen-cinema.up.railway.app/swagger

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Environment variables

```PORT``` - Port that app is listening to(8080 by default)\
```DB_HOST``` - Database host\
```DB_PORT``` - Database port\
```DB_USER``` - Database user\
```DB_PASSWORD``` - Database password\
```DB_NAME``` - Database name\
```JWT_ACCESS_SECRET``` - Secret for jwt access token\
```JWT_REFRESH_SECRET``` - Secret for jwt refresh token\
```GOOGLE_CLIENT_ID``` - Client id for google oauth service\
```GOOGLE_CLIENT_SECRET``` - Client secret for google oauth service\
```GOOGLE_CALLBACK_URL``` - Callback url for google oauth service\
```FACEBOOK_CLIENT_ID``` - Client id for facebook oauth service\
```FACEBOOK_CLIENT_SECRET``` - Client secret for facebook oauth service\
```FACEBOOK_CALLBACK_URL``` - Callback url for facebook oauth service\
```GITHUB_CLIENT_ID``` - Client id for gitHub oauth service\
```GITHUB_CLIENT_SECRET``` - Client secret for gitHub oauth service\
```GITHUB_CALLBACK_URL``` - Callback url for gitHub oauth service\
```AUTH_SUCCESS_REDIRECT``` - Url for success auth redirect

```
PORT=YOUR_PORT

DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME

JWT_ACCESS_SECRET=YOUR_JWT_ACCESS_TOKEN_SECRET
JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_TOKEN_SECRET

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=YOUR_GOOGLE_CALLBACK_URL

FACEBOOK_CLIENT_ID=YOUR_FACEBOOK_CLIENT_ID
FACEBOOK_CLIENT_SECRET=YOUR_FACEBOOK_CLIENT_SECRET
FACEBOOK_CALLBACK_URL=YOUR_FACEBOOK_CALLBACK_URL

GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL=YOUR_GITHUB_CALLBACK_URL

AUTH_SUCCESS_REDIRECT=YOUR_AUTH_SUCCESS_REDIRECT_URL
```
