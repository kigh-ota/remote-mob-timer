package kigh.rmt.timer;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Component
public class InMemoryTimerRepository implements TimerRepository {
    private final Map<TimerId, Timer> map = new HashMap<>();

    @Override
    public void add(TimerMetadata metadata) {
        if (exists(metadata.id)) {
            throw new IllegalArgumentException("duplicated id");
        }
        Timer timer = TimerFactory.create(metadata);
        map.put(metadata.id, timer);
    }

    @Override
    public boolean exists(TimerId id) {
        return map.containsKey(id);
    }

    @Override
    public Timer get(TimerId id) {
        return null;
    }

    @Override
    public Collection<TimerMetadata> listMetadata() {
        return null;
    }
}
