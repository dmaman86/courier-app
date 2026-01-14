package com.courier.resourceservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.courier.resourceservice.exception.EntityNotFoundException;
import com.courier.resourceservice.manager.OfficeManager;
import com.courier.resourceservice.objects.dto.OfficeBaseDto;
import com.courier.resourceservice.objects.entity.Branch;
import com.courier.resourceservice.objects.entity.Contact;
import com.courier.resourceservice.objects.entity.Office;
import com.courier.resourceservice.objects.mapper.OfficeMapper;
import com.courier.resourceservice.objects.response.OfficeResponse;
import com.courier.resourceservice.repository.OfficeRepository;
import com.courier.resourceservice.service.OfficeService;

@Service
public class OfficeServiceImpl implements OfficeService {

  private final OfficeRepository officeRepository;
  private final OfficeMapper officeMapper;
  private final OfficeManager officeManager;

  public OfficeServiceImpl(
      OfficeRepository officeRepository, OfficeMapper officeMapper, OfficeManager officeManager) {
    this.officeRepository = officeRepository;
    this.officeMapper = officeMapper;
    this.officeManager = officeManager;
  }

  /*@Override
  public Page<OfficeResponse> getOffices(Pageable pageable) {
    Page<Office> offices = officeRepository.findByEnabledTrue(pageable);
    return offices.map(this::mapToOfficeResponse);
  }*/

  @Override
  public List<OfficeBaseDto> getOfficesWithoutPagination() {
    var offices = officeRepository.findByEnabledTrue();
    return officeMapper.toBaseDtoList(offices);
  }

  @Override
  public OfficeBaseDto getOfficeBaseById(Long id) {
    return officeMapper.toBaseDto(officeManager.getOfficeById(id));
  }

  // @Override
  // public OfficeDto getOfficeById(Long id) {
  //   return officeMapper.toDto(searchOfficeById(id));
  // }

  private Office searchOfficeById(Long id) {
    return officeRepository
        .findById(id)
        .filter(Office::isEnabled)
        .orElseThrow(() -> new EntityNotFoundException("Office not found"));
  }

  @Override
  public OfficeBaseDto createOffice(OfficeBaseDto officeBaseDto) {
    Office office = officeManager.createOffice(officeBaseDto);
    return officeMapper.toBaseDto(office);
    // return officeMapper.toBaseDto(officeRepository.save(office));
  }

  // @Override
  // public OfficeResponse createOfficeWithBranches(OfficeDto officeDto) {
  //   Office savedOffice = officeManager.createOffice(officeDto);
  //   return mapToOfficeResponse(savedOffice);
  // }

  @Override
  public OfficeBaseDto updateOffice(Long id, OfficeBaseDto officeDto) {
    Office savedOffice = officeManager.updateOffice(id, officeDto);
    return officeMapper.toBaseDto(savedOffice);
    // return officeMapper.toDto(officeManager.updateOffice(id, officeDto));
  }

  @Override
  public void disabledOffice(Long id) {
    officeManager.disabledOffice(id);
  }

  // @Override
  // public Page<OfficeResponse> searchOffices(String searchQuery, Pageable pageable) {
  //   if (searchQuery == null || searchQuery.isEmpty()) {
  //     return Page.empty(pageable);
  //   }
  //
  //   Page<Office> offices =
  //       officeRepository.findByEnabledTrueAndNameContainingIgnoreCase(searchQuery, pageable);
  //   return offices.map(this::mapToOfficeResponse);
  // }

  private OfficeResponse mapToOfficeResponse(Office office) {
    Long countBranches =
        office.getBranches() != null
            ? office.getBranches().stream().filter(Branch::isEnabled).count()
            : 0;

    Long countContacts =
        office.getContacts() != null
            ? office.getContacts().stream().filter(Contact::isEnabled).count()
            : 0;

    return OfficeResponse.builder()
        .id(office.getId())
        .name(office.getName())
        .countBranches(countBranches)
        .countContacts(countContacts)
        .build();
  }
}
