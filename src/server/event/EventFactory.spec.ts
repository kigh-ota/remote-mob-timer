import EventFactory from './EventFactory';
import assert = require('assert');
import { EventType } from '../../common/IEvent';
import { TimerId } from '../timer/Timer';

describe('EventFactory.start', () => {
  it('works', () => {
    const actual = EventFactory.start(127, 'HOGE', 'ID' as TimerId);
    assert.deepStrictEqual(actual, {
      type: EventType.TIMER_START,
      id: 'ID',
      data: { sec: 127, name: 'HOGE' },
      date: actual.date, // skip
    });
  });
});
