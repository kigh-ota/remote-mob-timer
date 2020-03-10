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

## API

| Endpoint                                          | Description             | Request  | Response                                                            |
| :------------------------------------------------ | :---------------------- | :------- | :------------------------------------------------------------------ |
| `GET /v1/timer/{id}/status`                       | Get timer's status      |          | `{timer: {name, time, nClient, isRunning}, eventHistory: IEvent[]}` |
| `POST /v1/timer/{id}/reset?sec={sec}?name={name}` | Reset timer             |          |                                                                     |
| `POST /v1/timer/{id}/toggle?name={name}`          | Toggle timer start/stop |          | `{isRunning, time}`                                                 |
| `PUT /v1/timer/{id}/name`                         | Change timer name       | `{name}` |                                                                     |
| `POST /v1/timer/{id}/good?name={name}`            | Send a "good!" event    |          |                                                                     |
| `GET /v1/timers`                                  | Get list of timers      |          |                                                                     |
| `PUT /v1/timer/{id}`                              | Add a timer             |          |                                                                     |

## Environment variables

| Name             | Description                       |
| ---------------- | --------------------------------- |
| PORT             | HTTP Port                         |
| PERSISTENCE_TYPE | `{IN_MEMORY|MONGO_DB|FIRE_STORE}` |

## Uses

- [Chai](https://www.chaijs.com/)
- [Docker](https://www.docker.com/)
- [ESLint](https://eslint.org/)
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
