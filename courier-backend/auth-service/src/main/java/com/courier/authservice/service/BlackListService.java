package com.courier.authservice.service;

public interface BlackListService {

  void setUserId(Long userId);

  void cleanExpiredBlackListUsers();

  boolean isUserInBlackList(Long userId);
}
