package com.david.maman.courierserver.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.david.maman.courierserver.models.entities.OrderStatusHistory;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long>, JpaSpecificationExecutor<OrderStatusHistory>{

    // List<OrderStatusHistory> findByOrderIdByTimestamDesc(Long orderId);

    List<OrderStatusHistory> findByOrderIdOrderByTimestampDesc(Long orderId);
}
