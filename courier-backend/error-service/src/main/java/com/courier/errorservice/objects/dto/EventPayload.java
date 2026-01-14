package com.courier.errorservice.objects.dto;

import com.courier.errorservice.objects.enums.EventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPayload {
  private EventType eventType;
  private String data;
}
