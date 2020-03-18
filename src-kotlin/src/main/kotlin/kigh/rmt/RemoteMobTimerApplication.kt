package kigh.rmt

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

// TODO
// - Serve static contents
// -
@SpringBootApplication
@RestController
@EnableScheduling
class RemoteMobTimerApplication

fun main(args: Array<String>) {
    runApplication<RemoteMobTimerApplication>(*args)
}