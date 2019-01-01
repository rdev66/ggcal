package com.glencore.ch.globalcalendar.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class Calendar {

    @Id
    public String id;

    public String name;

    //ISO-3166
    public String countryCode;

    public boolean bank;

    //TODO add states, hierarchy and aggregate.

}
