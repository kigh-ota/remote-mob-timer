import { describe, it } from 'mocha';
import * as sinon from 'sinon';
import { expect } from 'chai';
import ReconnectingEventSource from './ReconnectingEventSource';
import EventSourceMock, { sources } from './EventSourceMock';
import { EventType } from '../common/IEvent';
import { fail } from 'assert';

const URL = '/events/';

describe('ReconnectingEventSource', () => {
  let clock: sinon.SinonFakeTimers;
  let createEventSourceStub: sinon.SinonStub;
  let consoleDebugStub: sinon.SinonStub;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    createEventSourceStub = sinon
      .stub(ReconnectingEventSource.prototype as any, 'createEventSource')
      .callsFake(() => new EventSourceMock(URL));
    consoleDebugStub = sinon.stub(console, 'debug');
  });

  afterEach(() => {
    consoleDebugStub.restore();
    createEventSourceStub.restore();
    clock.restore();
  });

  it('dispatch disconnected event after timeout', () => {
    const disconnectedEventSpy = sinon.spy();
    const sut = new ReconnectingEventSource(URL, 10, 20);
    sut.addEventListener('disconnected', disconnectedEventSpy);
    simulateAliveEvent();

    clock.tick(9000);
    expect(disconnectedEventSpy.callCount).to.equal(0);

    clock.tick(1500);
    expect(disconnectedEventSpy.callCount).to.equal(1);
  });

  it('try to reconnect every n seconds after disconnected', () => {
    new ReconnectingEventSource(URL, 10, 20);
    simulateAliveEvent();

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
    it('dispatch connected event and stop trying to reconnect when connection is recovered', () => {
      const sut = new ReconnectingEventSource(URL, 10, 20);
      const connectedEventSpy = sinon.spy();
      sut.addEventListener('connected', connectedEventSpy);
      expect(createEventSourceStub.callCount).to.equal(1);
      expect(connectedEventSpy.callCount).to.equal(0);

      simulateAliveEvent();
      expect(createEventSourceStub.callCount).to.equal(1);
      expect(connectedEventSpy.callCount).to.equal(1);

      clock.tick(40000); // wait 40s to ensure disconnected
      expect(createEventSourceStub.callCount).to.equal(2);
      expect(connectedEventSpy.callCount).to.equal(1);

      const ev = new MessageEvent(eventType, {});
      sources[URL].emit(ev.type, ev);
      expect(connectedEventSpy.callCount).to.equal(2);

      clock.tick(5000); // 45s
      sources[URL].emit(ev.type, ev);
      expect(connectedEventSpy.callCount).to.equal(2);

      clock.tick(5000); // 50s
      sources[URL].emit(ev.type, ev);
      expect(connectedEventSpy.callCount).to.equal(2);

      clock.tick(5000); // 55s
      expect(createEventSourceStub.callCount).to.equal(2);
      expect(connectedEventSpy.callCount).to.equal(2);
    });
  });

  it('does not dispatch connected event even when receives an event, unless disconnected', () => {
    const sut = new ReconnectingEventSource(URL, 10, 20);
    simulateAliveEvent();

    sut.addEventListener('connected', () => fail());
    simulateAliveEvent();
  });
});

function simulateAliveEvent() {
  const ev = new MessageEvent(EventType.ALIVE, {});
  sources[URL].emit(ev.type, ev);
}
