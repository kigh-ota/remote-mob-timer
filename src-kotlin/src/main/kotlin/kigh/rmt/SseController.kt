package kigh.rmt

import org.springframework.http.MediaType
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Controller
class SseController(private val sseEmitterPool: SseEmitterPool) {

    @GetMapping(path = ["/timer/1/events"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun events(): SseEmitter {
        val emitter = SseEmitter(0L)
        sseEmitterPool.add(emitter)
        return emitter
    }

}