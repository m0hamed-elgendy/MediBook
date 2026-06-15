import { Test, TestingModule } from '@nestjs/testing';
import { DoctorApplicationsService } from './doctor-applications.service';

describe('DoctorApplicationsService', () => {
  let service: DoctorApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorApplicationsService],
    }).compile();

    service = module.get<DoctorApplicationsService>(DoctorApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
