package com.courier.apigateway.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import com.courier.apigateway.service.BlackListService;

@Component
@EnableScheduling
public class BlackListServiceImpl implements BlackListService {

  @Autowired private StringRedisTemplate redisTemplate;

  private static final String BLACKLIST_PREFIX = "blacklist:";

  @Override
  public void handleUserIdEvent(Long userId) {
    long currentTime = System.currentTimeMillis();

    redisTemplate
        .opsForValue()
        .set(BLACKLIST_PREFIX + userId.toString(), String.valueOf(currentTime));
  }

  @Override
  public boolean isUserBlackListed(Long userId) {
    return redisTemplate.hasKey(BLACKLIST_PREFIX + userId.toString());
  }
}
