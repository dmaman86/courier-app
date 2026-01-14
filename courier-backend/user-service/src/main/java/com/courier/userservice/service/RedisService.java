package com.courier.userservice.service;

import java.util.List;

public interface RedisService {

  // void saveKeyValues(String publicKey, String authServiceSecret);

  String getPublicKey();

  List<String> getPublicKeys();

  String getAuthServiceSecret();

  boolean hasValidPublicKey();

  boolean hasKeys();
}
