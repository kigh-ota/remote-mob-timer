package kigh.rmt.v1

import kigh.rmt.timer.TimerId
import kigh.rmt.timer.TimerMetadata
import kigh.rmt.timer.TimerRepository
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class TimerController(private val timerRepository: TimerRepository) {

    @PutMapping(path = ["/v1/timer/{id}"])
    fun addTimer(@PathVariable id: String, @RequestParam(value = "name") name: String) {
        val metadata = TimerMetadata(TimerId(id), name)
        timerRepository.add(metadata)
    }

}