package com.smartcampus.resource.repository;

import com.smartcampus.resource.model.Resource;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByTypeIgnoreCase(String type);

    List<Resource> findByLocationIgnoreCase(String location);

    List<Resource> findByStatusIgnoreCase(String status);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    List<Resource> findByTypeIgnoreCaseAndLocationIgnoreCase(String type, String location);
}
