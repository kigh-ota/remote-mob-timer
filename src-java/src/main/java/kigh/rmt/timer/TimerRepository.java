package kigh.rmt.timer;

import java.util.Collection;

public interface TimerRepository {
    void add(TimerMetadata metadata);
    boolean exists(TimerId id);
    Timer get(TimerId id);
    Collection<TimerMetadata> listMetadata();
}
