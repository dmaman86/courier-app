package com.courier.resourceservice.service;

import java.util.List;

public interface RedisService {

  String getPublicKey();

  List<String> getPublicKeys();

  String getAuthServiceSecret();

  boolean hasValidPublicKey();

  boolean hasKeys();
}
