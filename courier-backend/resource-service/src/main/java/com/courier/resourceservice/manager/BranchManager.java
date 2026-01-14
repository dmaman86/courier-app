package com.courier.resourceservice.manager;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.courier.resourceservice.exception.BussinessRuleException;
import com.courier.resourceservice.exception.EntityExistsException;
import com.courier.resourceservice.exception.EntityNotFoundException;
import com.courier.resourceservice.objects.dto.BranchDto;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.repository.BranchRepository;
import com.courier.resourceservice.repository.ContactRepository;

@Component
public class BranchManager {

  @Autowired private BranchRepository branchRepository;
  @Autowired private ContactRepository contactRepository;
  @Autowired private OfficeManager officeManager;

  @Transactional
  public Branch createBranch(BranchDto branchDto) {
    Office office = getOffice(branchDto.getOffice());

    boolean existsBranch =
        branchRepository.existsByCityAndAddressAndOfficeIdAndEnabledTrue(
            branchDto.getCity(), branchDto.getAddress(), office.getId());

    if (existsBranch) throw new EntityExistsException("Branch already exists");

    Branch branch =
        Branch.builder().city(branchDto.getCity()).address(branchDto.getAddress()).build();
    branch.setOffice(office);
    branch.setEnabled(true);

    return branchRepository.save(branch);
  }

  @Transactional
  public Branch updateBranch(Long id, BranchDto branchDto) {
    Branch branch =
        branchRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Branch not found"));

    Office newOffice = getOffice(branchDto.getOffice());

    boolean isCityChanged = !branch.getCity().equals(branchDto.getCity());
    boolean isAddressChanged = !branch.getAddress().equals(branchDto.getAddress());
    boolean isOfficeChanged = !branch.getOffice().getId().equals(newOffice.getId());

    if (isCityChanged || isAddressChanged || isOfficeChanged) {
      boolean exists =
          branchRepository.existsByCityAndAddressAndOfficeIdAndEnabledTrue(
              branchDto.getCity(), branchDto.getAddress(), newOffice.getId());

      if (exists)
        throw new EntityExistsException(
            "Another branch with the same city and address already exists for this office");
    }

    if (!isOfficeChanged) {
      newOffice = officeManager.updateOffice(branch.getOffice().getId(), branchDto.getOffice());
    }

    branch.setCity(branchDto.getCity());
    branch.setAddress(branchDto.getAddress());
    branch.setOffice(newOffice);

    return branchRepository.save(branch);
  }

  @Transactional
  public void disableBranch(Long id) {
    Branch branch =
        branchRepository
            .findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Branch not found"));

    List<Contact> contacts = contactRepository.findAllByBranchesContainingAndEnabledTrue(branch);
    for (Contact contact : contacts) {
      if (contact.getBranches().size() == 1) {
        throw new BussinessRuleException(
            "Cannot remove branch "
                + branch.getId()
                + " because it's the only branch for contact "
                + contact.getId());
      }
      contact.getBranches().remove(branch);
    }

    branch.setEnabled(false);
    branch.setDisabledAt(LocalDateTime.now());
    branchRepository.save(branch);
  }

  @Transactional(readOnly = true)
  private Office getOffice(OfficeBaseDto office) {
    if (office.getId() != null) {
      return officeManager.getOfficeById(office.getId());
    }
    return officeManager.createOffice(office);
  }
}
