package kigh.rmt

import kigh.rmt.timer.InMemoryTimerRepository
import kigh.rmt.timer.TimerId
import kigh.rmt.timer.TimerMetadata
import kigh.rmt.timer.TimerRepository
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import javax.annotation.PostConstruct

// TODO
// - Run tests on CircleCI
// - POST /v1/timer/{id}/toggle
// - POST /v1/timer/{id}/reset
// - POST /v1/timer/{id}/good
// - PUT /v1/timer/{id}/name
// - PUT /v1/timer/{id}
@SpringBootApplication
@RestController
@EnableScheduling
class RemoteMobTimerApplication

fun main(args: Array<String>) {
    runApplication<RemoteMobTimerApplication>(*args)
}

@Configuration
class StaticConfig : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static-custom/images/")
        registry.addResourceHandler("/sounds/**").addResourceLocations("classpath:/static-custom/sounds/")
        registry.addResourceHandler("/javascripts/compiled/**").addResourceLocations("classpath:/static-custom/javascripts/compiled/")
        registry.addResourceHandler("/stylesheets/**").addResourceLocations("classpath:/static-custom/stylesheets/")
    }
}

@Component
class Initialization(private val timerRepository: TimerRepository) {
    @PostConstruct
    fun init() {
        timerRepository.add(TimerMetadata(TimerId("1"), "Timer1"))
    }
}