module.exports = class Timer {
  constructor(opt_handleTick, opt_handleOver, opt_handleStart, opt_handleStop) {
    this.timeout_ = null;
    this.remainingSec_ = 0;

    this.handleTick_ = opt_handleTick || (() => {});
    this.handleOver_ = opt_handleOver || (() => {});
    this.handleStart_ = opt_handleStart || (() => {});
    this.handleStop_ = opt_handleStop || (() => {});
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
    this.timeout_ = setInterval(() => this.onTick_(), 1000);
    this.handleStart_(this.remainingSec_);
  }

  stop(opt_ignoreStopHandler) {
    if (!this.timeout_) {
      return;
    }
    clearInterval(this.timeout_);
    this.timeout_ = null;
    opt_ignoreStopHandler || this.handleStop_(this.remainingSec_);
  }

  onTick_() {
    this.remainingSec_--;
    this.handleTick_ && this.handleTick_(this.remainingSec_);

    if (this.remainingSec_ <= 0) {
      this.remainingSec_ = 0;
      this.stop(true);
      this.handleOver_();
    }
  }
};
