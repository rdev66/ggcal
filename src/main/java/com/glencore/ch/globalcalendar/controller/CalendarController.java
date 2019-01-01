package com.glencore.ch.globalcalendar.controller;

import com.glencore.ch.globalcalendar.entity.Calendar;
import com.glencore.ch.globalcalendar.entity.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalendarController {


    final
    CalendarRepository calendarRepository;

    @Autowired
    public CalendarController(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    @GetMapping("/calendar/{countryCode}/{bank}")
    public Calendar calendar(@PathVariable(value = "countryCode") String countryCode, @PathVariable(value = "bank") boolean bank) {
        Calendar calendar = calendarRepository.findByCountryCodeAndBank(countryCode, bank);
        return calendar;
    }
}