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
    String summary;
    String startDate;
    String endDate;

    public EventDto(GlencoreEvent glencoreEvent) {
        this.id = glencoreEvent.getId();
        this.linkedCalendarId = glencoreEvent.getCalendarId();
        this.summary = glencoreEvent.getTitle();
        this.startDate = glencoreEvent.getStart().toString();
        this.endDate = glencoreEvent.getEnd().toString();
    }
}
