package com.david.maman.courierserver.helpers;

public enum StatusEnum {

    ACCEPTED(1L),
    DENIED(2L),
    IN_TRANSIT(3L),
    PENDING(4L),
    ON_HOLD(5L),
    DELIVERED(6L),
    FAILED_DELIVERY(7L),
    OUT_FOR_DELIVERY(8L),
    RETURNED(9L),
    CANCELLED(10L),
    PICKED_UP(11L),
    READY_FOR_PICKUP(12L),
    REJECTED(13L);

    private Long id;

    private StatusEnum(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
