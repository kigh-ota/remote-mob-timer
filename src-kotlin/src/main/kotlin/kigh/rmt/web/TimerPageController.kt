package kigh.rmt.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Controller
class TimerPageController {
@GetMapping(value = ["/timer/{id}"])
fun timerPage(): String {
    return "timer"
}
}