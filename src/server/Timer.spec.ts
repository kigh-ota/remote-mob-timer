import Timer from './Timer';
import * as sinon from 'sinon';
import assert = require('assert');

describe('Timer', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('does not tick unless started', () => {
    const onTickSpy = sinon.spy();
    const timer = new Timer(onTickSpy);
    timer.setTime(10);
    clock.tick(3000);
    assert.equal(onTickSpy.callCount, 0);
    assert.equal(timer.getTime(), 10);
  });

  it('ticks after started', () => {
    const onTickSpy = sinon.spy();
    const timer = new Timer(onTickSpy);
    timer.setTime(10);
    timer.start();
    clock.tick(2000);
    assert.equal(onTickSpy.callCount, 2);
    assert.equal(timer.getTime(), 8);
  });

  it('calls over() correctly', () => {
    const onOverSpy = sinon.spy();
    const timer = new Timer(() => {}, onOverSpy);
    timer.setTime(5);
    timer.start();
    clock.tick(4999);
    assert.equal(onOverSpy.callCount, 0);
    assert.equal(timer.getTime(), 1);
    clock.tick(1);
    assert.equal(onOverSpy.callCount, 1);
    assert.equal(timer.getTime(), 0);
  });
});
