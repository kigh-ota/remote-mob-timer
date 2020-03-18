package kigh.rmt.timer

interface TimerRepository {
    fun add(metadata: TimerMetadata)
    fun exists(id: TimerId): Boolean
    fun get(id: TimerId): Timer
    fun listMetadata(): Collection<TimerMetadata>
}