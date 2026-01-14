package com.courier.resourceservice.objects.criteria;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;

import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.objects.request.BranchSearchRequest;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class BranchCriteria {

  public static Specification<Branch> containsText(String text) {
    return (Root<Branch> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      String likePattern = "%" + text.toLowerCase() + "%";

      Predicate cityPredicate = cb.like(cb.lower(root.get("city")), likePattern);
      Predicate addressPredicate = cb.like(cb.lower(root.get("address")), likePattern);

      Join<Branch, Office> officeJoin = root.join("office", JoinType.LEFT);
      Predicate officeNamePredicate = cb.like(cb.lower(officeJoin.get("name")), likePattern);

      Predicate enabledPredicate = cb.isTrue(root.get("enabled"));

      return cb.and(enabledPredicate, cb.or(cityPredicate, addressPredicate, officeNamePredicate));
    };
  }

  public static Specification<Branch> advancedSearch(BranchSearchRequest request) {
    return (Root<Branch> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      List<Predicate> predicates = new ArrayList<>();
      predicates.add(cb.isTrue(root.get("enabled")));

      if (request.getAddress() != null && !request.getAddress().isEmpty()) {
        predicates.add(
            cb.like(cb.lower(root.get("address")), "%" + request.getAddress().toLowerCase() + "%"));
      }

      if (request.getCities() != null && !request.getCities().isEmpty()) {
        predicates.add(
            cb.lower(root.get("city"))
                .in(request.getCities().stream().map(String::toLowerCase).toList()));
      }

      if (request.getOffices() != null && !request.getOffices().isEmpty()) {
        // Join<Branch, Office> officeJoin = root.join("office", JoinType.LEFT);
        List<Long> officeIds =
            request.getOffices().stream()
                .map(OfficeBaseDto::getId)
                .filter(Objects::nonNull)
                .toList();
        predicates.add(root.get("office").get("id").in(officeIds));
        // if (!officeIds.isEmpty()) {
        // predicates.add(officeJoin.get("id").in(officeIds));
        // }
      }
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
