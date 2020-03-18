package kigh.rmt.timer

import org.springframework.stereotype.Component
import java.lang.IllegalArgumentException
import java.util.*

@Component
class InMemoryTimerRepository : TimerRepository {
    private val map: MutableMap<TimerId, Timer> =
        HashMap()

    override fun add(metadata: TimerMetadata) {
        require(!exists(metadata.id)) { "duplicated id" }
        val timer = TimerFactory.create(metadata)
        map[metadata.id] = timer
    }

    override fun exists(id: TimerId): Boolean {
        return map.containsKey(id)
    }

    override fun get(id: TimerId): Timer {
        return map.get(id) ?: throw IllegalArgumentException()
    }

    override fun listMetadata(): Collection<TimerMetadata> {
        return map.values.map { TimerMetadata(it.id, it.name)}
    }
}