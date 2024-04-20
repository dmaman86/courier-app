package com.david.maman.courierserver.helpers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;

@FunctionalInterface
public interface SearchByDateRange<T> {
    List<T> search(LocalDateTime startDate, LocalDateTime endDate, Sort sort);
}
