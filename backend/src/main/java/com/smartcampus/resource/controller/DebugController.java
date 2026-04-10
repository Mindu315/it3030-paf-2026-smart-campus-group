package com.smartcampus.resource.controller;

import com.smartcampus.resource.repository.ResourceRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final MongoTemplate mongoTemplate;
    private final ResourceRepository resourceRepository;
    private final Environment environment;

    public DebugController(
            MongoTemplate mongoTemplate,
            ResourceRepository resourceRepository,
            Environment environment) {
        this.mongoTemplate = mongoTemplate;
        this.resourceRepository = resourceRepository;
        this.environment = environment;
    }

    @GetMapping("/mongo")
    public Map<String, Object> mongoDebug() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("mongoUri", environment.getProperty("spring.mongodb.uri"));
        response.put("database", mongoTemplate.getDb().getName());
        response.put("collection", mongoTemplate.getCollectionName(com.smartcampus.resource.model.Resource.class));
        response.put("resourceCount", resourceRepository.count());
        return response;
    }
}
