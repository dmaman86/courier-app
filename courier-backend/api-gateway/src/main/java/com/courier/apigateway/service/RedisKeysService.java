package com.courier.apigateway.service;

import java.util.List;

public interface RedisKeysService {

  String getPublicKey();

  List<String> getPublicKeys();

  String getAuthServiceSecret();

  boolean hasValidPublicKey();
}
