import { Test, TestingModule } from '@nestjs/testing';
import { DoctorApplicationsController } from './doctor-applications.controller';

describe('DoctorApplicationsController', () => {
  let controller: DoctorApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorApplicationsController],
    }).compile();

    controller = module.get<DoctorApplicationsController>(DoctorApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
