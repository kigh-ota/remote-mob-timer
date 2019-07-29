import Timer from './Timer';
import * as sinon from 'sinon';
import assert = require('assert');

describe('Timer', () => {
  beforeEach(() => {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    this.clock.restore();
  });

  it('startしていなければtickしない', () => {
    const onTickSpy = sinon.spy();
    const timer = new Timer(onTickSpy);
    timer.setTime(10);
    this.clock.tick(3000);
    assert.equal(onTickSpy.callCount, 0);
    assert.equal(timer.getTime(), 10);
  });

  it('startしていればtickして時間が減る', () => {
    const onTickSpy = sinon.spy();
    const timer = new Timer(onTickSpy);
    timer.setTime(10);
    timer.start();
    this.clock.tick(2000);
    assert.equal(onTickSpy.callCount, 2);
    assert.equal(timer.getTime(), 8);
  });

  it('時間が来たらoverする', () => {
    const onOverSpy = sinon.spy();
    const timer = new Timer(() => {}, onOverSpy);
    timer.setTime(5);
    timer.start();
    this.clock.tick(4999);
    assert.equal(onOverSpy.callCount, 0);
    assert.equal(timer.getTime(), 1);
    this.clock.tick(1);
    assert.equal(onOverSpy.callCount, 1);
    assert.equal(timer.getTime(), 0);
  });
});
