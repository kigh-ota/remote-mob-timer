package kigh.rmt.timer

object TimerFactory {
    fun create(metadata: TimerMetadata): Timer {
        return TimerImpl(metadata)
    }
}