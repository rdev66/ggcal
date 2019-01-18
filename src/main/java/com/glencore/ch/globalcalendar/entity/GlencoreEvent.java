package com.glencore.ch.globalcalendar.entity;

import com.glencore.ch.globalcalendar.controller.dto.EventDto;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.component.VEvent;
import org.jetbrains.annotations.NotNull;
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
public class GlencoreEvent implements Comparable<GlencoreEvent> {

    @Id
    private String id;

    private String calendarId;

    LocalDate start;
    LocalDate end;
    String title;

    public GlencoreEvent(EventDto eventDto) {
        this.calendarId = eventDto.getLinkedCalendarId();
        this.start = LocalDate.parse(eventDto.getStart().substring(0, 10));
        this.end = LocalDate.parse(eventDto.getEnd().substring(0, 10));
        this.title = eventDto.getTitle();
    }

    public GlencoreEvent(VEvent newVEvent) {
        this.start = newVEvent.getStartDate().getDate()
                .toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.end = newVEvent.getStartDate().getDate()
                .toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        this.title = "*" + newVEvent.getSummary().getValue();
    }


    @Override
    public int compareTo(@NotNull GlencoreEvent o) {
        return this.getStart().isAfter(o.getStart()) ? 1 : -1;
    }
}
