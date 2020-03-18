package kigh.rmt.timer;

import java.util.Objects;

public class TimerId {
    private final String id;

    public TimerId(String id) {
        if (id.isBlank()) {
            throw new IllegalArgumentException();
        }
        // TODO more validation
        this.id = id;
    }

    public String value() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimerId timerId = (TimerId) o;
        return Objects.equals(id, timerId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
