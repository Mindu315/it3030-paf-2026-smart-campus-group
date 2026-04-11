package com.smartcampus.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    /**
     * Finds a user whose {@code roles} array contains any of the given values (MongoDB {@code $in}).
     * Used for ticket auto-assign so we match stored role strings exactly (avoids fragile regex from {@code Containing}).
     */
    Optional<User> findFirstByRolesIn(List<String> roles);
}
