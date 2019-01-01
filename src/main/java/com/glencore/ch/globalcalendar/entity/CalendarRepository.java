package com.glencore.ch.globalcalendar.entity;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Set;

public interface CalendarRepository extends MongoRepository<Calendar, String> {

    Set<Calendar> findAllByCountryCode(String firstName);

    Calendar findByCountryCodeAndBank(String countryCode, boolean isBankHoliday);
}