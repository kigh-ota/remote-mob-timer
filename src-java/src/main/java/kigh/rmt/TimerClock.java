package kigh.rmt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class TimerClock {
    private static final Logger log = LoggerFactory.getLogger(TimerClock.class);

    @Scheduled(fixedRate = 1000)
    public void tick() {
        log.info("tick");
    }
}
