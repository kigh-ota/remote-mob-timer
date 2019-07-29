import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import ReconnectingEventSource from './ReconnectingEventSource';
import EventSourceMock, { sources } from './EventSourceMock';
import { EventType } from '../common/IEvent';

const URL = '/events/';

describe('ReconnectingEventSource', () => {
  let clock: sinon.SinonFakeTimers;
  let createEventSourceStub: sinon.SinonStub;
  let consoleDebugStub: sinon.SinonStub;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    createEventSourceStub = sinon
      .stub(ReconnectingEventSource.prototype as any, 'createEventSource')
      .callsFake(() => {
        return new EventSourceMock(URL);
      });
    consoleDebugStub = sinon.stub(console, 'debug');
  });

  afterEach(() => {
    consoleDebugStub.restore();
    createEventSourceStub.restore();
    clock.restore();
  });

  it('calls onDisconnect() after n seconds', () => {
    const disconnectSpy = sinon.spy();
    new ReconnectingEventSource(URL, () => {}, disconnectSpy, 10, 20);

    clock.tick(9000);
    expect(disconnectSpy.callCount).to.equal(0);

    clock.tick(1500);
    expect(disconnectSpy.callCount).to.equal(1);
  });

  it('try to reconnect every n seconds after disconnected', () => {
    new ReconnectingEventSource(URL, () => {}, () => {}, 10, 20);
    clock.tick(29500);
    expect(createEventSourceStub.callCount).to.equal(1);

    clock.tick(1000);
    expect(createEventSourceStub.callCount).to.equal(2);

    clock.tick(20000);
    expect(createEventSourceStub.callCount).to.equal(3);

    clock.tick(20000);
    expect(createEventSourceStub.callCount).to.equal(4);
  });

  Object.values(EventType).forEach(eventType => {
    it('calls onConnected() and stop reconnecting when connection is recovered', () => {
      const onConnectedSpy = sinon.spy();
      new ReconnectingEventSource(URL, onConnectedSpy, () => {}, 10, 20);
      clock.tick(40000); // 40s
      expect(onConnectedSpy.callCount).to.equal(1);
      expect(createEventSourceStub.callCount).to.equal(2);

      const ev = new MessageEvent(eventType, {});
      sources[URL].emit(ev.type, ev);
      expect(onConnectedSpy.callCount).to.equal(2);

      clock.tick(5000); // 45s
      sources[URL].emit(ev.type, ev);

      clock.tick(5000); // 50s
      sources[URL].emit(ev.type, ev);

      clock.tick(5000); // 55s
      expect(onConnectedSpy.callCount).to.equal(2);
      expect(createEventSourceStub.callCount).to.equal(2);
    });
  });

  it('does not call onConnected() even when receives an event, unless disconnected', () => {
    const onConnectedSpy = sinon.spy();
    new ReconnectingEventSource(URL, onConnectedSpy, () => {}, 10, 20);
    expect(onConnectedSpy.callCount).to.equal(1);
    const ev = new MessageEvent(EventType.ALIVE, {});
    sources[URL].emit(ev.type, ev);
    expect(onConnectedSpy.callCount).to.equal(1);
  });
});
