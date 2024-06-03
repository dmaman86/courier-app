package com.david.maman.courierserver.models.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "origin_office_id", nullable = false)
    private Office originOffice;

    @ManyToOne
    @JoinColumn(name = "origin_branch_id", nullable = false)
    private Branch originBranch;

    @ManyToOne
    @JoinColumn(name = "destination_office_id")
    private Office destinationOffice;

    @ManyToOne
    @JoinColumn(name = "destination_branch_id")
    private Branch destinationBranch;

    @ManyToMany
    @JoinTable(
        name = "orders_contacts",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "contact_id")
    )
    private List<Contact> contacts;


    @ManyToMany
    @JoinTable(
        name = "orders_couriers",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "courier_id")
    )
    private List<User> couriers;

    private String deliveryDate;

    private String receiverName;

    private String receiverPhone;

    private String destinationAddress;

    private Boolean isDelivered;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistory> statusHistory;
}
