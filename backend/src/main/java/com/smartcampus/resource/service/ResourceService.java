package com.smartcampus.resource.service;

import com.smartcampus.resource.dto.ResourceRequestDto;
import com.smartcampus.resource.dto.ResourceResponseDto;
import java.util.List;

public interface ResourceService {

    ResourceResponseDto createResource(ResourceRequestDto requestDto);

    List<ResourceResponseDto> getAllResources();

    ResourceResponseDto getResourceById(String id);

    ResourceResponseDto updateResource(String id, ResourceRequestDto requestDto);

    void deleteResource(String id);

    List<ResourceResponseDto> filterResources(String type, String location, Integer minCapacity, String status);
}
