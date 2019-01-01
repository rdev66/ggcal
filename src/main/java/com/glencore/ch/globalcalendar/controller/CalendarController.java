package com.glencore.ch.globalcalendar.controller;

import com.glencore.ch.globalcalendar.entity.CalendarRepository;
import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.format.DateTimeFormatter;

import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

@Slf4j
@RestController
public class CalendarController {

    private final CalendarRepository calendarRepository;

    @Autowired
    public CalendarController(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    @GetMapping(value = "/calendar/{countryCode}/{bank}", produces = TEXT_PLAIN_VALUE)
    public String calendar(@PathVariable(value = "countryCode") String countryCode, @PathVariable(value = "bank") boolean bank) {
        GlencoreCalendar glencoreCalendar = calendarRepository.findByCountryCodeAndBank(countryCode, bank);
        return transformToICS(glencoreCalendar).toString();
    }

    private net.fortuna.ical4j.model.Calendar transformToICS(GlencoreCalendar glencoreCalendar) {
        net.fortuna.ical4j.model.Calendar calendar = new net.fortuna.ical4j.model.Calendar();
        calendar.getProperties().add(new ProdId("-//Glencore//iCal4j 1.0.2//EN"));
        calendar.getProperties().add(Version.VERSION_2_0);
        calendar.getProperties().add(CalScale.GREGORIAN);
        glencoreCalendar.getGlencoreEventSet().forEach(event -> calendar.getComponents().add(createVEvent(event)));
        return calendar;
    }

    private VEvent createVEvent(GlencoreEvent event) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            return new VEvent(new Date(formatter.format(event.getStartDate()), "yyyyMMdd")
                    , new Date(formatter.format(event.getEndDate()), "yyyyMMdd"), event.getSummary());
        } catch (ParseException pe) {
            log.error("Error parsing event date", pe);
            throw new RuntimeException(pe);
        }
    }
}