package com.thienpm.docuchat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class DocuchatApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocuchatApplication.class, args);
	}

}
