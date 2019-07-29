import { interval } from 'rxjs';
import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import ReconnectingEventSource from './ReconnectingEventSource';
import EventSourceMock from './EventSourceMock';

describe('ReconnectingEventSource', () => {
  let originalEventSource: any;

  beforeEach(() => {
    originalEventSource = (<any>window).EventSource; // FIXME  error TS2339: Property 'EventSource' does not exist on type 'Window'.
    Object.defineProperty(window, 'EventSource', EventSourceMock);
  });

  afterEach(() => {
    Object.defineProperty(window, 'EventSource', originalEventSource);
  });

  it('起動後n秒経過でonDisconnect()が実行される', () => {
    const clock = sinon.useFakeTimers();
    const disconnectSpy = sinon.spy();
    new ReconnectingEventSource('/events/', () => {}, disconnectSpy, 10);

    clock.tick(9000);
    expect(disconnectSpy.callCount).to.equal(0);
    clock.tick(1500);
    expect(disconnectSpy.callCount).to.equal(1);
  });
});
