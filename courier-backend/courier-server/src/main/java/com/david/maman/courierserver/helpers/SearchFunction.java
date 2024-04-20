package com.david.maman.courierserver.helpers;

import java.util.List;

@FunctionalInterface
public interface SearchFunction<T> {
    List<T> search(String toSearch);
}
