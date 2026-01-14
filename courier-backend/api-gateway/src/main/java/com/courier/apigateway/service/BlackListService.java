package com.courier.apigateway.service;

public interface BlackListService {

  void handleUserIdEvent(Long userId);

  // void cleanExpiredBlackList();

  boolean isUserBlackListed(Long userId);
}
