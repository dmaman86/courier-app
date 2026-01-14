package com.courier.userservice.service.impl;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.courier.userservice.service.BlackListService;

@Component
@EnableScheduling
public class BlackListServiceImpl implements BlackListService {

  @Autowired private StringRedisTemplate redisTemplate;

  private static final String BLACKLIST_PREFIX = "blacklist:";
  private static final long EXPIRATION_TIME = 20 * 60 * 1000; // 20 minutes

  @Override
  public void handleUserDisabledEvent(Long userId) {
    long currentTime = System.currentTimeMillis();

    redisTemplate
        .opsForValue()
        .set(BLACKLIST_PREFIX + userId.toString(), String.valueOf(currentTime));
  }

  @Override
  @Scheduled(fixedRate = 20 * 60 * 1000) // 20 minutes
  public void cleanExpiredBlackListUsers() {
    long currentTime = System.currentTimeMillis();

    Set<String> blackListKeys = redisTemplate.keys(BLACKLIST_PREFIX + "*");

    if (blackListKeys != null && !blackListKeys.isEmpty()) {
      for (String key : blackListKeys) {
        String timestampStr = redisTemplate.opsForValue().get(key);
        if (timestampStr != null) {
          long timestamp = Long.parseLong(timestampStr);
          if (currentTime - timestamp >= EXPIRATION_TIME) {
            redisTemplate.delete(key);
          }
        }
      }
    }
  }

  @Override
  public boolean isUserBlackListed(Long userId) {
    return redisTemplate.hasKey(BLACKLIST_PREFIX + userId.toString());
  }
}
