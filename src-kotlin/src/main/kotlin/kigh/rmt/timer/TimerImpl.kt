package kigh.rmt.timer

class TimerImpl(metadata: TimerMetadata) : Timer {
    override val id: TimerId = metadata.id
    override var name: String = metadata.name
    override var time: Int = 25 * 60
        get() = field
        set(value) {
            require(value >= 0)
            field = value
        }
    override var isRunning: Boolean = false
        private set

    override fun start() {
        isRunning = true
    }

    override fun stop() {
        isRunning = false
    }

    override fun tick(): Boolean {
        if (!isRunning || time == 0) {
            return false
        }
        time--
        if (time == 0) {
            isRunning = false
            return true
        }
        return false
    }
}