package com.courier.userservice.feignclient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.courier.userservice.objects.dto.ContactDto;
import com.courier.userservice.objects.request.UsersContactSearchRequest;

@FeignClient(name = "courier-resource-service", configuration = FeignClientConfig.class)
public interface ResourceFeignClient {

  @PostMapping("/api/resource/contact")
  ContactDto createContact(@RequestBody ContactDto contactDto);

  @PostMapping("/api/resource/contact/{id}")
  ContactDto updateContact(@PathVariable Long id, @RequestBody ContactDto contactDto);

  @DeleteMapping("/api/resource/contact/{id}")
  void disableContact(@PathVariable Long id);

  @PostMapping("/api/resource/contact/enable")
  ContactDto enableContact(@RequestBody ContactDto contactDto);

  @GetMapping("/api/resource/contact/phone/{phoneNumber}")
  ContactDto getContactByPhone(@PathVariable String phoneNumber);

  @PostMapping("/api/resource/contact/search/users")
  List<ContactDto> searchUsersContacts(
      @RequestBody UsersContactSearchRequest request,
      @RequestParam("page") int page,
      @RequestParam("size") int size);
}
