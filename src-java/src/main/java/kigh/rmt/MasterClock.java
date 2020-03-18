package kigh.rmt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class MasterClock {
    private static final Logger log = LoggerFactory.getLogger(MasterClock.class);

    private final SseEmitterPool sseEmitterPool;

    public MasterClock(SseEmitterPool sseEmitterPool) {
        this.sseEmitterPool = sseEmitterPool;
    }

    @Scheduled(fixedRate = 1000)
    public void tick() {
        log.debug("tick");
        List<SseEmitter> toBeRemoved = new ArrayList<>();
        sseEmitterPool.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("tick").build());
            } catch (IOException e) {
                log.debug("i/o error");
                toBeRemoved.add(emitter);
            }
        });
        if (!toBeRemoved.isEmpty()) {
            sseEmitterPool.removeAll(toBeRemoved);
        }
    }
}
