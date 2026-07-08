import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService, parseTimeToMinutes } from './appointments.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { getModelToken } from '@nestjs/mongoose';
import { Appointment } from './appointment.schema';
import { BadRequestException } from '@nestjs/common';

describe('parseTimeToMinutes', () => {
  it('should convert "02:30 PM" to 870', () => {
    expect(parseTimeToMinutes('02:30 PM')).toBe(870);
  });

  it('should convert "12:00 AM" to 0', () => {
    expect(parseTimeToMinutes('12:00 AM')).toBe(0);
  });

  it('should convert "12:00 PM" to 720', () => {
    expect(parseTimeToMinutes('12:00 PM')).toBe(720);
  });

  it('should convert "11:59 PM" to 1439', () => {
    expect(parseTimeToMinutes('11:59 PM')).toBe(1439);
  });

  it('should convert "08:00 AM" to 480', () => {
    expect(parseTimeToMinutes('08:00 AM')).toBe(480);
  });
});

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  const mockDoctor = {
    _id: 'doc1',
    user: { toString: () => 'patient1' },
    isActive: true,
    isApproved: true,
    availability: [
      { day: 'Thursday', from: '09:00 AM', to: '11:59 PM' },
      { day: 'Friday', from: '09:00 AM', to: '11:59 PM' },
      { day: 'Wednesday', from: '09:00 AM', to: '11:59 PM' },
    ],
  };

  const mockDoctorsService = {
    findOne: jest.fn().mockResolvedValue(mockDoctor),
  };

  const mockAppointmentModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: DoctorsService, useValue: mockDoctorsService },
        { provide: getModelToken(Appointment.name), useValue: mockAppointmentModel },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('date validation', () => {
    it('should allow booking for today at 11:00 PM', async () => {
      const todayStr = new Date().toLocaleDateString('en-CA');

      await expect(
        service.create('patient2', {
          doctor: 'doc1',
          date: todayStr,
          time: '11:00 PM',
          notes: '',
        }),
      ).resolves.toBeDefined();
    });

    it('should reject booking for yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');

      await expect(
        service.create('patient2', {
          doctor: 'doc1',
          date: yesterdayStr,
          time: '10:00 AM',
          notes: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow booking for tomorrow', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

      await expect(
        service.create('patient2', {
          doctor: 'doc1',
          date: tomorrowStr,
          time: '10:00 AM',
          notes: '',
        }),
      ).resolves.toBeDefined();
    });

    it('should reject booking for today when selected time has already passed', async () => {
      const todayStr = new Date().toLocaleDateString('en-CA');

      await expect(
        service.create('patient2', {
          doctor: 'doc1',
          date: todayStr,
          time: '12:05 AM',
          notes: '',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept today date even when time has passed (date validation is independent)', async () => {
      const todayStr = new Date().toLocaleDateString('en-CA');

      const result = service.create('patient2', {
        doctor: 'doc1',
        date: todayStr,
        time: '12:05 AM',
        notes: '',
      });

      await expect(result).rejects.toThrow('Cannot book an appointment in the past');
      await expect(result).rejects.not.toThrow('must be today or in the future');
    });
  });
});