package com.courier.authservice.service.impl;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.courier.authservice.service.RedisKeyService;

@Service
public class RedisKeyServiceImpl implements RedisKeyService {

  private static final Logger logger = LoggerFactory.getLogger(RedisKeyServiceImpl.class);

  @Autowired private StringRedisTemplate redisTemplate;

  private static final String LATEST_PUBLIC_KEY = "RSA_KEYS:latest_public_key";
  private static final String PUBLIC_KEYS_LIST = "RSA_KEYS:public_keys_list";
  private static final String PRIVATE_KEYS_MAP = "RSA_KEYS:private_keys_map";
  private static final String AUTH_SECRET_KEY = "RSA_KEYS:auth_service_secret";
  private static final int MAX_KEYS = 6;

  @Override
  public void setKeys(String privateKey, String publicKey, String authServiceSecret) {
    logger.info(
        "Getting keys from redis, public key: {}, auth service secret: {}",
        publicKey,
        authServiceSecret);

    redisTemplate.opsForValue().set(LATEST_PUBLIC_KEY, publicKey);

    redisTemplate.opsForList().rightPush(PUBLIC_KEYS_LIST, publicKey);

    redisTemplate.opsForHash().put(PRIVATE_KEYS_MAP, publicKey, privateKey);

    redisTemplate.opsForValue().set(AUTH_SECRET_KEY, authServiceSecret);

    trimOldKeys();
  }

  @Override
  public boolean isKeysLoaded() {
    return getPublicKey() != null && getAuthServiceSecret() != null;
  }

  @Override
  public String getPublicKey() {
    return redisTemplate.opsForValue().get(LATEST_PUBLIC_KEY);
  }

  @Override
  public String getAuthServiceSecret() {
    return redisTemplate.opsForValue().get(AUTH_SECRET_KEY);
  }

  @Override
  public String getPrivateKey(String publicKey) {
    return (String) redisTemplate.opsForHash().get(PRIVATE_KEYS_MAP, publicKey);
  }

  @Override
  public List<String> getPublicKeys() {
    List<String> publicKeys = redisTemplate.opsForList().range(PUBLIC_KEYS_LIST, 0, -1);
    return publicKeys != null ? publicKeys : Collections.emptyList();
  }

  @Override
  public void resetKeys() {
    redisTemplate.delete(LATEST_PUBLIC_KEY);
    redisTemplate.delete(AUTH_SECRET_KEY);
    redisTemplate.delete(PUBLIC_KEYS_LIST);
    redisTemplate.delete(PRIVATE_KEYS_MAP);
    logger.info("All keys removed from Redis");
  }

  private void trimOldKeys() {
    Long keyCount = redisTemplate.opsForList().size(PUBLIC_KEYS_LIST);
    if (keyCount != null && keyCount > MAX_KEYS) {
      String oldestPublicKey = redisTemplate.opsForList().leftPop(PUBLIC_KEYS_LIST);
      if (oldestPublicKey != null) {
        redisTemplate.opsForHash().delete(PRIVATE_KEYS_MAP, oldestPublicKey);
        logger.info("Removed old public key: {}", oldestPublicKey);
        logger.info("Removed private key associated with old public key: {}", oldestPublicKey);
      }

      Long updatedCount = redisTemplate.opsForList().size(PUBLIC_KEYS_LIST);
      logger.info(
          "Keys after cleanup: {} public keys in list, {} private keys in map",
          updatedCount,
          redisTemplate.opsForHash().size(PRIVATE_KEYS_MAP));
    } else {
      logger.info("No cleanup needed, current keys in list: {}", keyCount);
    }
  }
}
