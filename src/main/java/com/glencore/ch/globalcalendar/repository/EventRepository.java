package com.glencore.ch.globalcalendar.repository;

import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.stream.Stream;

public interface EventRepository extends MongoRepository<GlencoreEvent, String> {

    Stream<GlencoreEvent> findAllByCalendarId(String calendarId);


}