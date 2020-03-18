package kigh.rmt.timer;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class TimerIdTest {
    @Test
    public void equals() {
        assertThat(new TimerId("hoge").equals(new TimerId("hoge"))).isTrue();
    }
}