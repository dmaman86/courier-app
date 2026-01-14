package com.courier.apigateway.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.courier.apigateway.service.RedisKeysService;

@Service
public class RedisKeysServiceImpl implements RedisKeysService {

  @Autowired private StringRedisTemplate redisTemplate;

  private static final String LATEST_PUBLIC_KEY = "RSA_KEYS:latest_public_key";

  private static final String PUBLIC_KEYS_LIST = "RSA_KEYS:public_keys_list";

  private static final String AUTH_SECRET_KEY = "RSA_KEYS:auth_service_secret";

  @Override
  public String getPublicKey() {
    return redisTemplate.opsForValue().get(LATEST_PUBLIC_KEY);
  }

  @Override
  public String getAuthServiceSecret() {
    return redisTemplate.opsForValue().get(AUTH_SECRET_KEY);
  }

  @Override
  public boolean hasValidPublicKey() {
    return redisTemplate.hasKey(LATEST_PUBLIC_KEY);
  }

  @Override
  public List<String> getPublicKeys() {
    List<String> publicKeys = redisTemplate.opsForList().range(PUBLIC_KEYS_LIST, 0, -1);
    return publicKeys != null ? publicKeys : Collections.emptyList();
  }
}
