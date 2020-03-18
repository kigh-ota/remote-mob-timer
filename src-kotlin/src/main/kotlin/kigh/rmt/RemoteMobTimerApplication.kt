package kigh.rmt

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


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

@Configuration
class StaticConfig : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static-custom/images/")
        registry.addResourceHandler("/sounds/**").addResourceLocations("classpath:/static-custom/sounds/")
        registry.addResourceHandler("/javascripts/compiled/**").addResourceLocations("classpath:/static-custom/javascripts/compiled/")
        registry.addResourceHandler("/stylesheets/**").addResourceLocations("classpath:/static-custom/stylesheets/")
    }
}