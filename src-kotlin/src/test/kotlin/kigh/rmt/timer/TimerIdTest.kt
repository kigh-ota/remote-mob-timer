package kigh.rmt.timer;

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test;

class TimerIdTest {
    @Test
    fun equals() {
        assertThat(TimerId("hoge").equals(TimerId("hoge"))).isTrue();
    }
}