package com.glencore.ch.globalcalendar.controller.dto;

import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@EqualsAndHashCode
@Getter
@NoArgsConstructor
public class EventDto {

    String id;
    String linkedCalendarId;
    String title;
    String start;
    String end;

    public EventDto(GlencoreEvent glencoreEvent) {
        this.id = glencoreEvent.getId();
        this.linkedCalendarId = glencoreEvent.getCalendarId();
        this.title = glencoreEvent.getTitle();
        this.start = glencoreEvent.getStart().toString();
        this.end = glencoreEvent.getEnd().toString();
    }
}
