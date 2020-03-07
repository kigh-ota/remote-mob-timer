# Remote Mob Timer

[![CircleCI](https://circleci.com/gh/kigh-ota/remote-mob-timer.svg?style=svg)](https://circleci.com/gh/kigh-ota/remote-mob-timer)

## To run

```sh
docker-compose up -d
npm install && npm run build
npm run start
```

or

```sh
# Use in-memory DB for dev
npm install && npm run build
npm run start:dev
```

## Uses

- [Chai](https://www.chaijs.com/)
- [Docker](https://www.docker.com/)
- [Express](https://expressjs.com/)
- [Mocha](https://mochajs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Notification API](https://developer.mozilla.org/docs/Web/API/Notifications_API)
- [Power-assert](https://github.com/power-assert-js/power-assert)
- [Prettier](https://prettier.io/)
- [Pug](https://pugjs.org/)
- [React](https://ja.reactjs.org/)
- [RxJS](https://rxjs-dev.firebaseapp.com/)
- [Server-Sent Events](https://developer.mozilla.org/docs/Web/API/Server-sent_events)
- [Sinon.JS](https://sinonjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)

## API

| Endpoint              | Method | Description             |
| :-------------------- | :----: | :---------------------- |
| /v1/timer/{id}/status |  GET   | Get timer's status      |
| /v1/timer/{id}/reset  |  POST  | Reset timer             |
| /v1/timer/{id}/toggle |  POST  | Toggle timer start/stop |
| /v1/timer/{id}/name   |  PUT   | Change timer name       |
| /v1/timers            |  GET   | Get list of timers      |
| /v1/timer/{id}        |  PUT   | Add a timer             |

## Environment variables

| Name                | Description                       |
| ------------------- | --------------------------------- |
| PORT                | HTTP Port                         |
| USE_IN_MEMORY_STORE | Use in-memory store if set to `1` |
