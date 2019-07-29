import EventFactory from './EventFactory';
import assert = require('assert');
import { EventType } from '../common/IEvent';
describe('EventFactory.start', () => {
  it('works', () => {
    const actual = EventFactory.start(127, 'HOGE');
    assert.deepStrictEqual(actual, {
      type: EventType.TIMER_START,
      data: { sec: 127, name: 'HOGE' },
      date: actual.date // skip
    });
  });
});