package com.david.maman.courierserver.helpers;

public enum StateEnum {
    ACCEPTED(1L),
    DENIED(2L),
    TAKEN(3L),
    PENDING(4L),
    PENDING_TAKEN(5L),
    DELIVERED(6L),
    UNDELIVERED(7L),
    REQUIRED_TO_RETURN(8L),
    RETURNED(9L),
    CANCELED(10L);

    private final long id;

    private StateEnum(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
