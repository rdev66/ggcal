package com.glencore.ch.globalcalendar;

import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import com.glencore.ch.globalcalendar.repository.CalendarRepository;
import com.glencore.ch.globalcalendar.repository.EventRepository;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;

@Slf4j
@SpringBootApplication
public class GlobalCalendarApplication implements CommandLineRunner {

    private final CalendarRepository calendarRepository;
    private final EventRepository eventRepository;

    @Autowired
    public GlobalCalendarApplication(CalendarRepository calendarRepository, EventRepository eventRepository) {
        this.calendarRepository = calendarRepository;
        this.eventRepository = eventRepository;
    }


    public static void main(String[] args) {

        SpringApplication.run(GlobalCalendarApplication.class, args);
    }

    @Override
    public void run(String... args) {

        calendarRepository.deleteAll();

        net.fortuna.ical4j.model.Date today = new Date(java.util.Date.from(Instant.now()));
        net.fortuna.ical4j.model.Date tomorrow = new Date(java.util.Date.from(LocalDate.now()
                .plusDays(1L).atStartOfDay(ZoneId.systemDefault()).toInstant()));

        GlencoreEvent sampleEvent1 = new GlencoreEvent(null, "1", LocalDate.now(), LocalDate.now().plusDays(1), "Holiday 1");
        GlencoreEvent sampleEvent2 = new GlencoreEvent(null, "1", LocalDate.now().plusDays(1), LocalDate.now().plusDays(2), "Holiday 2");
        GlencoreEvent bankHolidayEvent1 = new GlencoreEvent(null, "1", LocalDate.now().plusDays(3), LocalDate.now().plusDays(4), "Bank holiday");

        eventRepository.save(sampleEvent1);
        eventRepository.save(sampleEvent2);
        eventRepository.save(bankHolidayEvent1);

        calendarRepository.save(new GlencoreCalendar(null, "Spain, official holidays", "ES", 2019, Set.of(sampleEvent1, sampleEvent2, bankHolidayEvent1), null, null));


        // fetch all customers
        System.out.println("Calendars found with findAll():");
        System.out.println("-------------------------------");
        for (GlencoreCalendar customer : calendarRepository.findAll()) {
            System.out.println(customer);
        }
        System.out.println();

        // fetch an individual glencoreCalendar
        System.out.println("GlencoreCalendar found with findAllByCountryCode('ES'):");
        System.out.println("--------------------------------");
        System.out.println(calendarRepository.findAllByCountryCode("ES"));

        System.out.println("Calendars found with findAllByCountryCodeAndBank('ES', false):");
        System.out.println("--------------------------------");
        GlencoreCalendar glencoreCalendar = calendarRepository.findByCountryCodeAndYear("ES", 2019);
        System.out.println(glencoreCalendar);
    }
}


