package com.glencore.ch.globalcalendar.entity;

import com.glencore.ch.globalcalendar.controller.dto.EventDto;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.component.VEvent;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.ZoneId;

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

    LocalDate start;
    LocalDate end;
    String title;

    public GlencoreEvent(EventDto eventDto) {
        this.calendarId = eventDto.getLinkedCalendarId();
        this.start = LocalDate.parse(eventDto.getStartDate());
        this.end = LocalDate.parse(eventDto.getEndDate());
        this.title = eventDto.getSummary();
    }

    public GlencoreEvent(VEvent newVEvent) {
        this.start = newVEvent.getStartDate().getDate()
                .toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.end = newVEvent.getStartDate().getDate()
                .toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.title = "IMPORTED: " + newVEvent.getSummary().getValue();
    }
}
