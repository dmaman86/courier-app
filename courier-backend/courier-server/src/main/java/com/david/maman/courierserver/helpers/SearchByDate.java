package com.david.maman.courierserver.helpers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;

import com.david.maman.courierserver.models.entities.Status;

@FunctionalInterface
public interface SearchByDate<T> {
    List<T> search(LocalDateTime date, List<Status> statuses, Sort sort);
}
