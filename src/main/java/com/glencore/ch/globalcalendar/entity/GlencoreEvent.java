package com.glencore.ch.globalcalendar.entity;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class GlencoreEvent {

    LocalDate startDate;
    LocalDate endDate;
    String summary;
    @Id
    private String id;

}
