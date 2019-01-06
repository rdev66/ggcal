package com.glencore.ch.globalcalendar.entity;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.Set;

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

    //TODO add states, hierarchy and aggregate.

}
