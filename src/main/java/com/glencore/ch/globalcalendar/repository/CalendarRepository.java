package com.glencore.ch.globalcalendar.repository;

import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CalendarRepository extends MongoRepository<GlencoreCalendar, String> {

    GlencoreCalendar findByCountryCodeAndYear(String countryCode, int year);

    GlencoreCalendar findByNameAndCountryCodeAndYear(String name, String countryCode, int year);

    List<GlencoreCalendar> findAllByCreatedBy(String id);

    List<GlencoreCalendar> findAllByCountryCode(String countryCode);

}