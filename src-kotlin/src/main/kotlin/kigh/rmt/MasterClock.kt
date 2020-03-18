package kigh.rmt

import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.io.IOException
import java.util.*

@Component
class MasterClock(private val sseEmitterPool: SseEmitterPool) {
    companion object {
        private val log = LoggerFactory.getLogger(MasterClock::class.java)
    }

    @Scheduled(fixedRate = 1000)
    fun tick() {
        log.debug("tick")
        val toBeRemoved: MutableList<SseEmitter> = ArrayList()
        sseEmitterPool.forEach { emitter: SseEmitter ->
            try {
                emitter.send(SseEmitter.event().name("tick").build())
            } catch (e: IOException) {
                log.debug("i/o error")
                toBeRemoved.add(emitter)
            } catch (e: IllegalStateException) {
                log.debug("illegal state error")
                toBeRemoved.add(emitter)
            }
        }
        if (!toBeRemoved.isEmpty()) {
            sseEmitterPool.removeAll(toBeRemoved)
        }
    }
}