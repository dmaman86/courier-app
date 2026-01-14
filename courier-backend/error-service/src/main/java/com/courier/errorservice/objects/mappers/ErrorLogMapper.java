package com.courier.errorservice.objects.mappers;

import org.springframework.stereotype.Component;

import com.courier.errorservice.objects.dto.ErrorLogDto;
import com.courier.errorservice.objects.entity.ErrorLog;

@Component
public class ErrorLogMapper {

  public ErrorLog toEntity(ErrorLogDto errorLogDto) {
    return ErrorLog.builder()
        .timestamp(errorLogDto.getTimestamp())
        .status(errorLogDto.getStatus())
        .error(errorLogDto.getError())
        .message(errorLogDto.getMessage())
        .exception(errorLogDto.getException())
        .path(errorLogDto.getPath())
        .severity(errorLogDto.getSeverity())
        .build();
  }
}
