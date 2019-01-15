package com.glencore.ch.globalcalendar.scheduler;

import com.glencore.ch.globalcalendar.scheduler.tasks.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private final EmailService emailService;

    @Autowired
    public ScheduledTasks(EmailService emailService) {
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 7 * * ?")
    public void sendEmails() {
        log.info("The time is now {}", dateFormat.format(new Date()));
        emailService.sendSimpleMessage("test@to.com", "Holiday-email", "Holiday!");
    }
}