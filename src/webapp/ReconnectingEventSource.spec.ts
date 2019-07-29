import { interval } from 'rxjs';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import ReconnectingEventSource from './ReconnectingEventSource';
import EventSourceMock from './EventSourceMock';

describe('ReconnectingEventSource', () => {
  it('test', () => {
    Object.defineProperty(window, 'EventSource', EventSourceMock);

    // new EventSource('/events/');
    new ReconnectingEventSource('/events/');

    const clock = sinon.useFakeTimers();
    const spy = sinon.spy();
    const sub = interval(1000).subscribe(spy);
    expect(spy.callCount).to.equal(0);
    clock.tick(1500);
    expect(spy.callCount).to.equal(1);
    clock.tick(2000);
    expect(spy.callCount).to.equal(3);
    clock.restore();
    sub.unsubscribe();
  });
});
