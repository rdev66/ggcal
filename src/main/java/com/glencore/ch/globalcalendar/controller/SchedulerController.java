package com.glencore.ch.globalcalendar.controller;

import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import com.glencore.ch.globalcalendar.repository.CalendarRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api")
public class SchedulerController {

    private final CalendarRepository calendarRepository;

    @Autowired
    public SchedulerController(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    //http://localhost:8080/api/isDateBankHolidayInCountry/2019-01-09/ES
    @GetMapping(value = "/isDateBankHolidayInCountry/{date}/{countryCode}")
    public boolean isDateBankHolidayInCountry(@PathVariable final String date, @PathVariable String countryCode) {
        return calendarRepository.findByCountryCodeAndYear(countryCode, LocalDate.parse(date).getYear())
                .getEvents().stream().anyMatch(event -> isWithinRange(LocalDate.parse(date), event));

    }

    private boolean isWithinRange(LocalDate testDate, GlencoreEvent event) {
        //isEqualOrBefore startDate && isEqualOrAfter endDate
        return !testDate.isBefore(event.getStart()) && !testDate.isAfter(event.getEnd());
    }
}