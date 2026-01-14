package com.courier.userservice.objects.criteria;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.courier.userservice.objects.entity.Role;
import com.courier.userservice.objects.entity.User;
import com.courier.userservice.objects.request.UserSearchRequest;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class UserCriteria {

  public static Specification<User> containsTextInAttributes(String text) {
    return (Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      String likePattern = "%" + text.toLowerCase() + "%";

      Predicate enabledPredicate = cb.isTrue(root.get("enabled"));
      Predicate fullNamePredicate = cb.like(cb.lower(root.get("fullName")), likePattern);
      Predicate emailPredicate = cb.like(cb.lower(root.get("email")), likePattern);
      Predicate phonePredicate = cb.like(cb.lower(root.get("phoneNumber")), likePattern);

      Subquery<Long> roleSubquery = query.subquery(Long.class);
      Root<User> subRoot = roleSubquery.from(User.class);
      Join<User, Role> rolesJoin = subRoot.join("roles");
      roleSubquery
          .select(subRoot.get("id"))
          .where(cb.like(cb.lower(rolesJoin.get("name")), likePattern));

      Predicate rolePredicate = cb.in(root.get("id")).value(roleSubquery);

      return cb.and(
          enabledPredicate,
          cb.or(fullNamePredicate, emailPredicate, phonePredicate, rolePredicate));
    };
  }

  public static Specification<User> advancedSearch(
      UserSearchRequest request, List<String> clientPhoneNumbers) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      predicates.add(cb.isTrue(root.get("enabled")));

      if (request.getFullName() != null) {
        predicates.add(
            cb.like(
                cb.lower(root.get("fullName")), "%" + request.getFullName().toLowerCase() + "%"));
      }
      if (request.getEmail() != null) {
        predicates.add(
            cb.like(cb.lower(root.get("email")), "%" + request.getEmail().toLowerCase() + "%"));
      }

      if (request.getPhoneNumber() != null) {
        predicates.add(
            cb.like(
                cb.lower(root.get("phoneNumber")),
                "%" + request.getPhoneNumber().toLowerCase() + "%"));
      }

      if (request.getRoles() != null && !request.getRoles().isEmpty()) {
        Join<User, Role> rolesJoin = root.join("roles");
        CriteriaBuilder.In<String> in = cb.in(rolesJoin.get("name"));
        request.getRoles().forEach(role -> in.value(role.getName()));
        predicates.add(in);
      }

      if (clientPhoneNumbers != null && !clientPhoneNumbers.isEmpty()) {
        predicates.add(root.get("phoneNumber").in(clientPhoneNumbers));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
