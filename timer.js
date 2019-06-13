module.exports = class Timer {
  constructor() {
    this.running_ = false;
    this.min_ = 0;
    this.sec_ = 0;
  }

  getTime() {
    return { min: this.min_, sec: this.sec_ };
  }

  isRunning() {
    return this.running_;
  }

  setTime(min, sec) {
    this.min_ = min;
    this.sec_ = sec;
  }

  start() {
    if (this.running_) {
      return;
    }
    this.running_ = true;
  }

  stop() {
    if (!this.running_) {
      return;
    }
    this.running_ = false;
  }
};
