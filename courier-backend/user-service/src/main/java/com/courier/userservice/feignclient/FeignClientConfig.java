package com.courier.userservice.feignclient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FeignClientConfig {

  @Bean
  public RequestInterceptor cookieRelayInterceptor() {
    return new RequestInterceptor() {
      @Override
      public void apply(RequestTemplate template) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes) {
          HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
          String cookie = request.getHeader("Cookie");
          if (cookie != null) {
            template.header("Cookie", cookie);
          }
        }
      }
    };
  }

  @Bean
  public FeignErrorDecoder feignErrorDecoder() {
    return new FeignErrorDecoder();
  }
}
