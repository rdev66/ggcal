package com.glencore.ch.globalcalendar.repository;

import com.glencore.ch.globalcalendar.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

}
