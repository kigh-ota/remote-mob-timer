package kigh.rmt.timer;

public class TimerFactory {
    static Timer create(TimerMetadata metadata) {
        return new TimerImpl(metadata);
    }
}
