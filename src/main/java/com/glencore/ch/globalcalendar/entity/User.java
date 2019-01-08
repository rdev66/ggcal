package com.glencore.ch.globalcalendar.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String userId;
    private String name;
    private String email;
    private boolean admin;
    private boolean master;
    private String country;
}