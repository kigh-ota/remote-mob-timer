package kigh.rmt

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.*
import java.util.function.Consumer

@Component
class SseEmitterPool {
    private val pool: MutableCollection<SseEmitter> = ArrayList()
    fun add(emitter: SseEmitter) {
        pool.add(emitter)
        log.info("# of clients = {}", pool.size)
    }

    fun forEach(f: (SseEmitter)->Unit) {
        pool.forEach(f)
    }

    fun removeAll(emitters: Collection<SseEmitter>) {
        pool.removeAll(emitters)
        log.info("# of clients = {}", pool.size)
    }

    companion object {
        val log = LoggerFactory.getLogger(SseEmitterPool::class.java)
    }
}