package kigh.rmt.timer

import java.util.*

class TimerId(id: String) {
    private val id: String
        get() = field

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || javaClass != other.javaClass) return false
        val timerId = other as TimerId
        return id == timerId.id
    }

    override fun hashCode(): Int {
        return Objects.hash(id)
    }

    init {
        require(!id.isBlank())
        // TODO more validation
        this.id = id
    }
}