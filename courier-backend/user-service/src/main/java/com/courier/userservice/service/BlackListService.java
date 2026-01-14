package com.courier.userservice.service;

public interface BlackListService {

  void handleUserDisabledEvent(Long userId);

  void cleanExpiredBlackListUsers();

  boolean isUserBlackListed(Long userId);
}
