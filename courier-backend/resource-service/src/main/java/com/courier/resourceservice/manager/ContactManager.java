package com.courier.resourceservice.manager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.courier.resourceservice.exception.BussinessRuleException;
import com.courier.resourceservice.exception.EntityExistsException;
import com.courier.resourceservice.exception.EntityNotFoundException;
import com.courier.resourceservice.objects.dto.BranchBaseDto;
import com.courier.resourceservice.objects.dto.ContactDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.repository.BranchRepository;
import com.courier.resourceservice.repository.ContactRepository;
import com.courier.resourceservice.repository.OfficeRepository;

@Component
public class ContactManager {

  @Autowired private ContactRepository contactRepository;
  @Autowired private OfficeRepository officeRepository;
  @Autowired private BranchRepository branchRepository;

  // @Autowired private ContactMapper contactMapper;

  @Transactional
  public Contact createContact(ContactDto contactDto) {
    Office office =
        officeRepository
            .findById(contactDto.getOffice().getId())
            .orElseThrow(() -> new EntityNotFoundException("Office not found"));

    boolean existsContact =
        contactRepository.existsByPhoneNumberAndEnabledTrue(contactDto.getPhoneNumber());

    if (existsContact)
      throw new EntityExistsException("Contact with this phone number already exists");

    List<Branch> branches = validateBranches(contactDto.getBranches(), office);
    if (branches.isEmpty()) {
      throw new BussinessRuleException(
          "Contact must be assigned to at least one branch of the office");
    }

    // Contact contact = contactMapper.toEntity(contactDto, branches);
    Contact contact =
        Contact.builder()
            .fullName(contactDto.getFullName())
            .phoneNumber(contactDto.getPhoneNumber())
            .office(office)
            .branches(branches)
            .build();
    return contactRepository.save(contact);
  }

  @Transactional
  public Contact updateContact(Long id, ContactDto contactDto) {
    Contact contact =
        contactRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Contact not found"));

    Office office =
        officeRepository
            .findById(contactDto.getOffice().getId())
            .orElseThrow(() -> new EntityNotFoundException("Office not found"));

    List<Branch> branches = validateBranches(contactDto.getBranches(), office);
    if (branches.isEmpty()) {
      throw new RuntimeException("Contact must be assigned to at least one branch of the office");
    }

    contact.setFullName(contactDto.getFullName());
    contact.setPhoneNumber(contactDto.getPhoneNumber());
    contact.setOffice(office);

    contact.getBranches().clear();
    contact.getBranches().addAll(branches);

    return contactRepository.save(contact);
  }

  @Transactional
  public void disableContact(Long id) {
    try {
      Contact contact =
          contactRepository
              .findById(id)
              .orElseThrow(() -> new EntityNotFoundException("Contact not found " + id));

      contact.getBranches().clear();
      contact.setEnabled(false);
      contact.setDisabledAt(LocalDateTime.now());
      contactRepository.save(contact);

    } catch (EntityNotFoundException e) {
      throw new EntityNotFoundException(e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException("Error disabling contact with id: " + id);
    }
  }

  @Transactional
  public Contact enableContact(ContactDto contactDto) {
    try {
      Contact contact =
          contactRepository
              .findById(contactDto.getId())
              .orElseThrow(() -> new EntityNotFoundException("Contact not found"));

      if (contact.isEnabled())
        throw new BussinessRuleException("Contact is already enabled: " + contact.getId());

      contact.setEnabled(true);
      contact.setDisabledAt(null);

      contact.setOffice(
          officeRepository
              .findById(contactDto.getOffice().getId())
              .orElseThrow(() -> new EntityNotFoundException("Office not found")));

      List<Branch> restoredBranches =
          contactDto.getBranches().stream()
              .map(
                  branchDto ->
                      branchRepository
                          .findById(branchDto.getId())
                          .orElseThrow(() -> new EntityNotFoundException("Branch not found")))
              .collect(Collectors.toList());

      contact.setBranches(restoredBranches);
      return contactRepository.save(contact);
    } catch (EntityNotFoundException e) {
      throw new EntityNotFoundException(e.getMessage());
    } catch (BussinessRuleException e) {
      throw new BussinessRuleException(e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException("Error enabling contact with id: " + contactDto.getId());
    }
  }

  private List<Branch> validateBranches(List<BranchBaseDto> branchDtos, Office office) {
    if (branchDtos == null || branchDtos.isEmpty()) {
      throw new EntityNotFoundException("At least one branch must be assigned to the contact");
    }

    List<Long> branchIds =
        branchDtos.stream().map(BranchBaseDto::getId).collect(Collectors.toList());

    List<Branch> branches =
        branchRepository.findByIdInAndOfficeIdAndEnabledTrue(branchIds, office.getId());

    if (branches.size() != branchIds.size()) {
      throw new EntityNotFoundException(
          "Some branches are invalid or do not belong to the specified office");
    }

    return branches;
  }
}
