package com.glencore.ch.globalcalendar.controller;

import com.glencore.ch.globalcalendar.controller.dto.CalendarDto;
import com.glencore.ch.globalcalendar.controller.dto.EventDto;
import com.glencore.ch.globalcalendar.entity.GlencoreCalendar;
import com.glencore.ch.globalcalendar.entity.GlencoreEvent;
import com.glencore.ch.globalcalendar.entity.User;
import com.glencore.ch.globalcalendar.repository.CalendarRepository;
import com.glencore.ch.globalcalendar.repository.EventRepository;
import com.glencore.ch.globalcalendar.repository.UserRepository;
import com.google.common.base.Strings;
import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.model.Date;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.CalScale;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URISyntaxException;
import java.security.Principal;
import java.text.ParseException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.TEXT_PLAIN_VALUE;

@Slf4j
@RestController
@RequestMapping("/api")
public class CalendarController {

    private final CalendarRepository calendarRepository;
    private final EventRepository eventRepository;
    //
    private UserRepository userRepository;

    @Autowired
    public CalendarController(CalendarRepository calendarRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.calendarRepository = calendarRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }


    @GetMapping(value = "/calendars")
    public List<GlencoreCalendar> listAllCalendars() {
        return calendarRepository.findAll();
    }

    @GetMapping("/userCalendars")
    Collection<GlencoreCalendar> groups(Principal principal) {
        return calendarRepository.findAllByCreatedBy(principal.getName());
    }

    //Actual calendar subscription.
    @GetMapping(value = "/calendar/{countryCode}/{bank}", produces = TEXT_PLAIN_VALUE)
    public String getCalendar(@PathVariable(value = "countryCode") String countryCode, @PathVariable(value = "bank") boolean bank) {
        GlencoreCalendar glencoreCalendar = calendarRepository.findByCountryCodeAndBank(countryCode, bank);
        return transformToICS(glencoreCalendar).toString();
    }

    @GetMapping(value = "/calendar/{id}", produces = TEXT_PLAIN_VALUE)
    public ResponseEntity<?> getCalendar(@PathVariable(value = "id") String id) {
        Optional<GlencoreCalendar> glencoreCalendar = calendarRepository.findById(id);
        return glencoreCalendar.map(response -> ResponseEntity.ok().body(transformToICS(response).toString()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(value = "/calendar")
    @ResponseStatus(HttpStatus.OK)
    public void addCalendar(@Valid @RequestBody CalendarDto calendarDto,
                            @AuthenticationPrincipal OAuth2User principal) throws URISyntaxException {
        log.info("Request to add calendar: {}", calendarDto);

        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();
        // check to see if user already exists
        Optional<User> user = userRepository.findById(userId);
        GlencoreCalendar calendar = new GlencoreCalendar(calendarDto);

        calendar.setCreatedBy(user.orElse(new User(userId,
                details.get("name").toString(), details.get("email").toString())));

        calendar.setId(null);
        calendarRepository.save(calendar);
        log.info("Calendar {} created!", calendar);
    }


    @PutMapping(value = "/calendar")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<GlencoreCalendar> editCalendar(@Valid @RequestBody CalendarDto calendarDto) {
        log.info("Request to update calendar: {}", calendarDto);

        GlencoreCalendar calendar = calendarRepository
                .findById(calendarDto.getId())
                .orElseThrow(() -> new RuntimeException("No Result found"));

        calendar.setBank(calendarDto.isBank());
        calendar.setCountryCode(calendarDto.getCountryCode());
        calendar.setName(calendarDto.getName());
        calendar.setYear(calendarDto.getYear());
        calendar.setEvents(calendarDto.getEvents().stream()
                .map(GlencoreEvent::new).collect(Collectors.toSet()));

        GlencoreCalendar result = calendarRepository.save(calendar);
        log.info("Calendar {} updated!", calendar);
        return ResponseEntity.ok().body(result);

    }

    @DeleteMapping(value = "/calendar")
    public ResponseEntity<?> deleteCalendar(@RequestBody CalendarDto calendarDto) {
        GlencoreCalendar glencoreCalendarToDelete;
        //IDs are internal to mongo
        if (Strings.isNullOrEmpty(calendarDto.getId())) {
            glencoreCalendarToDelete = getByProperties(calendarDto);
        } else {
            glencoreCalendarToDelete = calendarRepository
                    .findById(calendarDto.getId()).orElseThrow(() -> new RuntimeException("No Result found"));
        }
        calendarRepository.delete(glencoreCalendarToDelete);
        log.info("Calendar name: {}, removed!!", glencoreCalendarToDelete);
        return ResponseEntity.ok().build();
    }

    private GlencoreCalendar getByProperties(CalendarDto calendarDto) {
        return calendarRepository
                .findByNameAndCountryCodeAndBankAndYear(calendarDto.getName()
                        , calendarDto.getCountryCode()
                        , calendarDto.isBank(), calendarDto.getYear());
    }

    private net.fortuna.ical4j.model.Calendar transformToICS(GlencoreCalendar glencoreCalendar) {
        net.fortuna.ical4j.model.Calendar calendar = new net.fortuna.ical4j.model.Calendar();
        calendar.getProperties().add(new ProdId("-//Glencore//iCal4j 1.0.2//EN"));
        calendar.getProperties().add(Version.VERSION_2_0);
        calendar.getProperties().add(CalScale.GREGORIAN);
        glencoreCalendar.getEvents().forEach(event -> calendar.getComponents().add(createVEvent(event)));
        return calendar;
    }

    private VEvent createVEvent(GlencoreEvent event) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");

            return new VEvent(new Date(formatter.format(event.getStartDate()), "yyyyMMdd")
                    , new Date(formatter.format(event.getEndDate()), "yyyyMMdd"), event.getSummary());
        } catch (ParseException pe) {
            log.error("Error parsing event date", pe);
            throw new RuntimeException(pe);
        }
    }

    @PostMapping(value = "/event")
    @ResponseStatus(HttpStatus.CREATED)
    public void addCalendar(@RequestBody EventDto eventDto) {
        eventRepository.save(new GlencoreEvent(eventDto));
    }

    @GetMapping(value = "/event/{calendarId}")
    public Set<EventDto> listEventsByCalendar(@PathVariable(value = "calendarId") String calendarId) {
        return eventRepository.findAllByCalendarId(calendarId).map(EventDto::new).collect(Collectors.toSet());
    }
}