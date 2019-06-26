module.exports = class Timer {
  constructor(opt_onTick, opt_onOver) {
    this.timeout_ = null;
    this.remainingSec_ = 0;

    this.onTick_ = opt_onTick || (() => {});
    this.onOver_ = opt_onOver || (() => {});
  }

  isRunning() {
    return !!this.timeout_;
  }

  getTime() {
    return this.remainingSec_;
  }

  setTime(sec) {
    if (this.isRunning()) {
      return;
    }
    this.remainingSec_ = sec;
  }

  start() {
    if (this.timeout_) {
      return;
    }
    this.timeout_ = setInterval(() => this.tick_(), 1000);
  }

  stop() {
    if (!this.timeout_) {
      return;
    }
    clearInterval(this.timeout_);
    this.timeout_ = null;
  }

  tick_() {
    this.remainingSec_--;
    this.onTick_(this.remainingSec_);

    if (this.remainingSec_ <= 0) {
      this.remainingSec_ = 0;
      this.stop();
      this.onOver_();
    }
  }
};
