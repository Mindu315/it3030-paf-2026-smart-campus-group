package com.smartcampus.resource.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceResponseDto {

    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String availabilityStart;
    private String availabilityEnd;
    private String status;
    private String description;
}
