package kigh.rmt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class RemoteMobTimerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RemoteMobTimerApplication.class, args);
	}

	@GetMapping("/hello")
	public String hello() {

		return "Hello world";
	}
}
