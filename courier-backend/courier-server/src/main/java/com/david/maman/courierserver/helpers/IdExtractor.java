package com.david.maman.courierserver.helpers;

@FunctionalInterface
public interface IdExtractor<T> {
    Long getId(T entity);
}
