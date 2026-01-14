package com.courier.resourceservice.manager;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.courier.resourceservice.exception.BussinessRuleException;
import com.courier.resourceservice.exception.EntityNotFoundException;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.repository.ContactRepository;
import com.courier.resourceservice.repository.OfficeRepository;

@Component
public class OfficeManager {

  @Autowired private OfficeRepository officeRepository;
  @Autowired private ContactRepository contactRepository;
  @Autowired @Lazy private BranchManager branchManager;

  @Transactional(readOnly = true)
  public Office getOfficeById(Long id) {
    return officeRepository
        .findByIdAndEnabledTrue(id)
        .orElseThrow(() -> new EntityNotFoundException("Office not found"));
  }

  @Transactional
  public Office createOffice(OfficeBaseDto officeBaseDto) {
    Office office = Office.builder().name(officeBaseDto.getName()).build();
    office.setEnabled(true);

    return officeRepository.save(office);
  }

  @Transactional
  public Office updateOffice(Long id, OfficeBaseDto officeDto) {
    Office office =
        officeRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Office not found"));

    if (!office.getName().equals(officeDto.getName())) {
      office.setName(officeDto.getName());
    }

    return officeRepository.save(office);
  }

  @Transactional
  public void disabledOffice(Long id) {
    Office office =
        officeRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Office not found"));

    List<Contact> contacts = contactRepository.findAllByOfficeAndEnabledTrue(office);

    if (!contacts.isEmpty()) {
      throw new BussinessRuleException(
          "Cannot disable office " + office.getId() + " because it has active contacts assigned");
    }

    office.getBranches().stream()
        .filter(Branch::isEnabled)
        .forEach(branch -> branchManager.disableBranch(branch.getId()));

    office.setEnabled(false);
    office.setDisabledAt(LocalDateTime.now());
    officeRepository.save(office);
  }
}
