package com.glencore.ch.globalcalendar.controller.dto;

import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;
import java.util.stream.Collectors;

@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
public class CalendarDto {

    String id;
    String name;
    boolean bank;
    String countryCode;
    int year;
    String externalCalendarUrl;


    Set<EventDto> events;

    public CalendarDto(GlencoreCalendar calendar) {
        this.id = calendar.getId();
        this.name = calendar.getName();
        this.bank = calendar.isBank();
        this.countryCode = calendar.getCountryCode();
        this.year = calendar.getYear();
        this.externalCalendarUrl = calendar.getExternalCalendarUrl();
        this.events = calendar.getEvents().stream().map(EventDto::new).collect(Collectors.toSet());
    }
}
