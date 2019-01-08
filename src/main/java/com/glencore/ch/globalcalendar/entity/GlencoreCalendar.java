package com.glencore.ch.globalcalendar.entity;

import com.glencore.ch.globalcalendar.controller.dto.CalendarDto;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.Set;
import java.util.stream.Collectors;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@EqualsAndHashCode
public class GlencoreCalendar {

    @Id
    private String id;

    private String name;

    //ISO-3166
    private String countryCode;

    private boolean bank;

    private int year;

    private Set<GlencoreEvent> events;

    private User createdBy;

    //TODO add states, hierarchy and aggregate.


    public GlencoreCalendar(CalendarDto calendarDto) {
        this.id = calendarDto.getId();
        this.name = calendarDto.getName();
        this.bank = calendarDto.isBank();
        this.countryCode = calendarDto.getCountryCode();
        this.year = calendarDto.getYear();
        this.events = calendarDto.getEvents().stream().map(GlencoreEvent::new).collect(Collectors.toSet());
    }

}
