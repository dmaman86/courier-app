package com.david.maman.courierserver.models.criteria;

import org.springframework.data.jpa.domain.Specification;

import com.david.maman.courierserver.models.entities.Branch;
import com.david.maman.courierserver.models.entities.Contact;
import com.david.maman.courierserver.models.entities.Office;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class ContactSpecification {

    public static Specification<Contact> containsTextInAttributes(String text){
        return (Root<Contact> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            String likePattern = "%" + text.toLowerCase() + "%";

            Predicate namePredicate = cb.like(cb.lower(root.get("name")), likePattern);
            Predicate lastNamePredicate = cb.like(cb.lower(root.get("lastName")), likePattern);
            Predicate phonePredicate = cb.like(cb.lower(root.get("phone")), likePattern);

            Join<Contact, Office> officeJoin = root.join("office", JoinType.LEFT);
            Predicate officePredicate = cb.like(cb.lower(officeJoin.get("name")), likePattern);

            Join<Contact, Branch> branchJoin = root.join("branches", JoinType.LEFT);
            Predicate branchCityPredicate = cb.like(cb.lower(branchJoin.get("city")), likePattern);
            Predicate branchAddressPredicate = cb.like(cb.lower(branchJoin.get("address")), likePattern);

            return cb.or(namePredicate, lastNamePredicate, phonePredicate, officePredicate, branchCityPredicate, branchAddressPredicate);
        };
    }

}
