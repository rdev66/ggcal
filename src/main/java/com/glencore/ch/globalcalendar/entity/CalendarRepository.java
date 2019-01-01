package com.glencore.ch.globalcalendar.entity;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Set;

public interface CalendarRepository extends MongoRepository<GlencoreCalendar, String> {

    Set<GlencoreCalendar> findAllByCountryCode(String firstName);

    GlencoreCalendar findByCountryCodeAndBank(String countryCode, boolean isBankHoliday);
}