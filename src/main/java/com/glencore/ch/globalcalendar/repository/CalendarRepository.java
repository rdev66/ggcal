package com.glencore.ch.globalcalendar.repository;

import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface CalendarRepository extends MongoRepository<GlencoreCalendar, String> {

    Set<GlencoreCalendar> findAllByCountryCode(String countryCode);

    GlencoreCalendar findByCountryCodeAndBank(String countryCode, boolean isBankHoliday);

    GlencoreCalendar findByCountryCodeAndBankIsTrue(String countryCode);


    GlencoreCalendar findByNameAndCountryCodeAndBankAndYear(String name, String countryCode, boolean bank, int year);

    List<GlencoreCalendar> findAllByCreatedBy(String id);
}