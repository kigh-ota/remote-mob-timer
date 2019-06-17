module.exports = class Timer {
  constructor(opt_handleTick, opt_handleOver) {
    this.timeout_ = null;
    this.sec_ = 0;
    this.handleTick_ = opt_handleTick;
    this.handleOver_ = opt_handleOver;
  }

  getTime() {
    return { min: Math.floor(this.sec_ / 60), sec: this.sec_ % 60 };
  }

  isRunning() {
    return !!this.timeout_;
  }

  setTime(sec) {
    this.sec_ = sec;
  }

  start() {
    if (this.timeout_) {
      return;
    }
    this.timeout_ = setInterval(() => this.onTick_(), 1000);
  }

  stop() {
    if (!this.timeout_) {
      return;
    }
    clearInterval(this.timeout_);
    this.timeout_ = null;
  }

  onTick_() {
    this.sec_--;
    this.handleTick_ && this.handleTick_(this.sec_);

    if (this.sec_ <= 0) {
      this.sec_ = 0;
      this.stop();
      this.handleOver_ && this.handleOver_();
    }
  }
};
