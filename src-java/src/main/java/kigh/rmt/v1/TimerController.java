package kigh.rmt.v1;

import kigh.rmt.timer.TimerId;
import kigh.rmt.timer.TimerMetadata;
import kigh.rmt.timer.TimerRepository;
import org.springframework.web.bind.annotation.*;

@RestController
public class TimerController {

    private final TimerRepository timerRepository;

    public TimerController(TimerRepository timerRepository) {
        this.timerRepository = timerRepository;
    }

    @PutMapping(path="/v1/timer/{id}")
    public void addTimer(@PathVariable String id, @RequestParam(value = "name") String name) {
        var metadata = new TimerMetadata(new TimerId(id), name);
        timerRepository.add(metadata);
    }
}
