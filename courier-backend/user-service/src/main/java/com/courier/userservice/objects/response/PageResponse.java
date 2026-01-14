package com.courier.userservice.objects.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
  private List<T> content;
  private int totalPages;
  private long totalElements;
  private int size;
  private int number;
  private boolean last;
  private boolean first;
  private boolean empty;
}
