package com.smartcampus.resource.service.impl;

import com.smartcampus.resource.dto.ResourceRequestDto;
import com.smartcampus.resource.dto.ResourceResponseDto;
import com.smartcampus.resource.exception.ResourceNotFoundException;
import com.smartcampus.resource.model.Resource;
import com.smartcampus.resource.repository.ResourceRepository;
import com.smartcampus.resource.service.ResourceService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    
    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto requestDto) {
        Resource resource = mapToEntity(requestDto);
        Resource savedResource = resourceRepository.save(resource);
        return mapToResponseDto(savedResource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDto getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return mapToResponseDto(resource);
    }

    @Override
    public ResourceResponseDto updateResource(String id, ResourceRequestDto requestDto) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        existingResource.setName(requestDto.getName());
        existingResource.setType(requestDto.getType());
        existingResource.setCapacity(requestDto.getCapacity());
        existingResource.setLocation(requestDto.getLocation());
        existingResource.setAvailabilityStart(requestDto.getAvailabilityStart());
        existingResource.setAvailabilityEnd(requestDto.getAvailabilityEnd());
        existingResource.setStatus(requestDto.getStatus());
        existingResource.setDescription(requestDto.getDescription());

        Resource updatedResource = resourceRepository.save(existingResource);
        return mapToResponseDto(updatedResource);
    }

    @Override
    public void deleteResource(String id) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(existingResource);
    }

    @Override
    public List<ResourceResponseDto> filterResources(String type, String location, Integer minCapacity, String status) {
        return resourceRepository.findAll()
                .stream()
                .filter(resource -> type == null || resource.getType() != null
                        && resource.getType().equalsIgnoreCase(type))
                .filter(resource -> location == null || resource.getLocation() != null
                        && resource.getLocation().equalsIgnoreCase(location))
                .filter(resource -> minCapacity == null || resource.getCapacity() != null
                        && resource.getCapacity() >= minCapacity)
                .filter(resource -> status == null || resource.getStatus() != null
                        && resource.getStatus().equalsIgnoreCase(status))
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private Resource mapToEntity(ResourceRequestDto dto) {
        Resource resource = new Resource();
        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setAvailabilityStart(dto.getAvailabilityStart());
        resource.setAvailabilityEnd(dto.getAvailabilityEnd());
        resource.setStatus(dto.getStatus());
        resource.setDescription(dto.getDescription());
        return resource;
    }

    private ResourceResponseDto mapToResponseDto(Resource resource) {
        ResourceResponseDto responseDto = new ResourceResponseDto();
        responseDto.setId(resource.getId());
        responseDto.setName(resource.getName());
        responseDto.setType(resource.getType());
        responseDto.setCapacity(resource.getCapacity());
        responseDto.setLocation(resource.getLocation());
        responseDto.setAvailabilityStart(resource.getAvailabilityStart());
        responseDto.setAvailabilityEnd(resource.getAvailabilityEnd());
        responseDto.setStatus(resource.getStatus());
        responseDto.setDescription(resource.getDescription());
        return responseDto;
    }
}
