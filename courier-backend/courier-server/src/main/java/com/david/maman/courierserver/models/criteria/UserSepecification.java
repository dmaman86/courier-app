package com.david.maman.courierserver.models.criteria;

import org.springframework.data.jpa.domain.Specification;

import com.david.maman.courierserver.models.entities.User;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class UserSepecification {

    public static Specification<User> containsTextInAttributes(String text, boolean isActive){
        return (Root<User> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            String likePattern = "%" + text.toLowerCase() + "%";
            Predicate isActivePredicate = cb.equal(root.get("isActive"), isActive);
            
            Predicate namePredicate = cb.like(cb.lower(root.get("name")), likePattern);
            Predicate lastNamePredicate = cb.like(cb.lower(root.get("lastName")), likePattern);
            Predicate phonePredicate = cb.like(cb.lower(root.get("phone")), likePattern);
            Predicate emailPredicate = cb.like(cb.lower(root.get("email")), likePattern);

            return cb.and(isActivePredicate, cb.or(namePredicate, lastNamePredicate, phonePredicate, emailPredicate));
        };
    }
}
