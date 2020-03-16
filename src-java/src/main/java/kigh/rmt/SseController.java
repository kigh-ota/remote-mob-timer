package kigh.rmt;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Controller
public class SseController {

    private final SseEmitterPool sseEmitterPool;

    public SseController(SseEmitterPool sseEmitterPool) {
        this.sseEmitterPool = sseEmitterPool;
    }

    @GetMapping(path="/timer/1/events", produces= MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter events() {
        var emitter = new SseEmitter();
        sseEmitterPool.add(emitter);
        return emitter;
    }
}
