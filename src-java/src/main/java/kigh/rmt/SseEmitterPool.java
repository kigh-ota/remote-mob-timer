package kigh.rmt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Consumer;

@Component
public class SseEmitterPool {
    final static Logger log = LoggerFactory.getLogger(SseEmitterPool.class);

    private Collection<SseEmitter> pool = new ArrayList<>();

    public void add(SseEmitter emitter) {
        pool.add(emitter);
        log.info("# of clients = {}", pool.size());
    }

    public void forEach(Consumer<SseEmitter> f) {
        pool.forEach(f);
    }

    public void removeAll(Collection<SseEmitter> emitters) {
        pool.removeAll(emitters);
        log.info("# of clients = {}", pool.size());
    }
}
