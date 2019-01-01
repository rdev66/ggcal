package com.glencore.ch.globalcalendar;

import com.glencore.ch.globalcalendar.entity.Calendar;
import com.glencore.ch.globalcalendar.entity.CalendarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class GlobalCalendarApplication implements CommandLineRunner {

    private final CalendarRepository repository;

    @Autowired
    public GlobalCalendarApplication(CalendarRepository repository) {
        this.repository = repository;
    }


    public static void main(String[] args) {

        SpringApplication.run(GlobalCalendarApplication.class, args);
    }

    @Override
    public void run(String... args) {

        repository.deleteAll();

        // save a couple of customers
        repository.save(new Calendar(null, "ES-Hol-1", "ES", false));
        repository.save(new Calendar(null, "ES-Bank-1", "ES", true));

        // fetch all customers
        System.out.println("Calendars found with findAll():");
        System.out.println("-------------------------------");
        for (Calendar customer : repository.findAll()) {
            System.out.println(customer);
        }
        System.out.println();

        // fetch an individual calendar
        System.out.println("Calendar found with findAllByCountryCode('ES'):");
        System.out.println("--------------------------------");
        System.out.println(repository.findAllByCountryCode("ES"));

        System.out.println("Calendars found with findAllByCountryCodeAndBank('ES', false):");
        System.out.println("--------------------------------");
        Calendar calendar = repository.findByCountryCodeAndBank("ES", false);
        System.out.println(calendar);
    }
}


