package com.courier.authservice.objects.dto;

import com.courier.authservice.objects.enums.EventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventPayload {
  private EventType eventType;
  private String data;
}
