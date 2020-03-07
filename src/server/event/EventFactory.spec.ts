import EventFactory from './EventFactory';
import assert = require('assert');
import { EventType } from '../../common/IEvent';
import { TimerId } from '../timer/Timer';

describe('EventFactory.start', () => {
  it('works', () => {
    const actual = EventFactory.start(
      127,
      'HOGE',
      'TIMER_NAME',
      'ID' as TimerId
    );
    assert.deepStrictEqual(actual, {
      type: EventType.START,
      id: 'ID',
      data: { sec: 127, userName: 'HOGE', timerName: 'TIMER_NAME' },
      date: actual.date, // skip
    });
  });
});
