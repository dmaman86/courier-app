package com.courier.authservice.service;

import java.util.List;

public interface RedisKeyService {

  void setKeys(String privateKey, String publicKey, String authServiceSecret);

  String getPublicKey();

  String getPrivateKey(String publicKey);

  String getAuthServiceSecret();

  List<String> getPublicKeys();

  boolean isKeysLoaded();

  void resetKeys();
}
