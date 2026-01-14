package com.courier.resourceservice.objects.criteria;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.objects.request.ContactSearchRequest;
import com.courier.resourceservice.objects.request.UsersContactSearchRequest;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ContactCriteria {

  public static Specification<Contact> containsText(String text) {
    return (Root<Contact> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      String likePattern = "%" + text.toLowerCase() + "%";

      Predicate fullNamePredicate = cb.like(cb.lower(root.get("fullName")), likePattern);
      Predicate phoneNumberPredicate = cb.like(cb.lower(root.get("phoneNumber")), likePattern);

      Join<Contact, Office> officeJoin = root.join("office", JoinType.LEFT);
      Predicate officeNamePredicate = cb.like(cb.lower(officeJoin.get("name")), likePattern);

      Predicate enabledPredicate = cb.isTrue(root.get("enabled"));

      return cb.and(
          enabledPredicate, cb.or(fullNamePredicate, phoneNumberPredicate, officeNamePredicate));
    };
  }

  public static Specification<Contact> containsSpec(UsersContactSearchRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      predicates.add(cb.isTrue(root.get("enabled")));

      if (StringUtils.hasText(request.getFullName()))
        predicates.add(
            cb.like(
                cb.lower(root.get("fullName")), "%" + request.getFullName().toLowerCase() + "%"));

      if (StringUtils.hasText(request.getPhoneNumber()))
        predicates.add(
            cb.like(
                cb.lower(root.get("phoneNumber")),
                "%" + request.getPhoneNumber().toLowerCase() + "%"));

      if (StringUtils.hasText(request.getAddress()))
        predicates.add(
            cb.like(cb.lower(root.get("address")), "%" + request.getAddress().toLowerCase() + "%"));

      if (request.getOffices() != null && !request.getOffices().isEmpty()) {
        List<Long> officeIds =
            request.getOffices().stream()
                .map(OfficeBaseDto::getId)
                .filter(Objects::nonNull)
                .toList();

        if (!officeIds.isEmpty()) predicates.add(root.get("office").get("id").in(officeIds));
      }

      if (request.getBranches() != null && !request.getBranches().isEmpty()) {
        List<Long> branchIds =
            request.getBranches().stream()
                .map(BranchBaseDto::getId)
                .filter(Objects::nonNull)
                .toList();

        if (!branchIds.isEmpty()) {
          Join<Contact, Branch> branchJoin = root.join("branches");
          predicates.add(branchJoin.get("id").in(branchIds));
        }
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  public static Specification<Contact> extendedSpec(ContactSearchRequest request) {
    Specification<Contact> baseSpec = containsSpec((UsersContactSearchRequest) request);

    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      Predicate basePredicate = baseSpec.toPredicate(root, query, cb);
      predicates.add(basePredicate);

      if (request.getCities() != null && !request.getCities().isEmpty()) {
        Join<Contact, Branch> branchJoin = root.join("branches");
        CriteriaBuilder.In<String> inClause = cb.in(cb.lower(branchJoin.get("city")));
        request.getCities().forEach(city -> inClause.value(city.toLowerCase()));
        predicates.add(inClause);
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
