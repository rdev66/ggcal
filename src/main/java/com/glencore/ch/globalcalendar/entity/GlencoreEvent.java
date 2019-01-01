package com.glencore.ch.globalcalendar.entity;

import com.glencore.ch.globalcalendar.controller.dto.EventDto;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Slf4j
public class GlencoreEvent {

    @Id
    private String id;

    private String calendarId;

    LocalDate startDate;
    LocalDate endDate;
    String summary;

    public GlencoreEvent(EventDto eventDto) {
        this.calendarId = eventDto.getLinkedCalendarId();
        this.startDate = LocalDate.parse(eventDto.getStartDate());
        this.endDate = LocalDate.parse(eventDto.getEndDate());
        this.summary = eventDto.getSummary();
    }
}
