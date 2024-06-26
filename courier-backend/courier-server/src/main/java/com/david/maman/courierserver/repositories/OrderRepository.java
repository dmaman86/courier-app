package com.david.maman.courierserver.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.david.maman.courierserver.models.entities.Order;
import com.david.maman.courierserver.models.entities.Status;

public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order>{

    Page<Order> findByClientId(Long clientId, Pageable pageable);

    @Query(value = "SELECT * FROM orders o JOIN orders_couriers oc ON o.id = oc.order_id WHERE oc.courier_id = :courierId AND o.delivery_date = CURRENT_DATE AND o.is_delivered = false", nativeQuery = true)
    Page<Order> findOrdersByCourierIdForToday(@Param("courierId") Long courierId, Pageable pageable);

    Page<Order> findAll(Pageable pageable);
    // List<Order> findAll();

    List<Order> findByClientIdAndCurrentStatusIdNotIn(Long clientId, List<Long> statusIds);

    List<Order> findByCurrentStatusIdNotIn(List<Long> statusIds);

    Page<Order> findByClientIdAndCurrentStatusNotIn(Long clientId, List<Status> statuses, Pageable pageable);

    List<Order> findByCurrentStatusId(Long statusId);

    Page<Order> findByCouriers_Id(Long courierId, Pageable pageable);

    Page<Order> findByCouriers(Long courierId, Pageable pageable);
}
