
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apikey } from 'src/entities/apikey.entity';
import { Exam } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { Result } from 'src/entities/result.entity';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApikeyService } from './openai.service';
import { Readable } from 'stream';

// Mock các dependencies (Apikey, Exam, User, Result repositories)
const mockApikeyRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockExamRepository = () => ({
  findOne: jest.fn(),
});

const mockResultRepository = () => ({
  findOne: jest.fn(),
});

// Mock GoogleGenerativeAI và các phương thức của nó
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockReturnValue({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest
            .fn()
            .mockResolvedValue(
              '```json[{"content": "Câu hỏi 1"}, {"content": "Câu hỏi 2"}]```',
            ),
        },
      }),
    }),
  }),
}));

describe('ApikeyService', () => {
  let service: ApikeyService;
  let apikeyRepository: Repository<Apikey>;
  let examRepository: Repository<Exam>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApikeyService,
        {
          provide: getRepositoryToken(Apikey),
          useFactory: mockApikeyRepository,
        },
        {
          provide: getRepositoryToken(Exam),
          useFactory: mockExamRepository,
        },
        {
          provide: getRepositoryToken(Result),
          useFactory: mockResultRepository,
        },
      ],
    }).compile();

    service = module.get<ApikeyService>(ApikeyService);
    apikeyRepository = module.get<Repository<Apikey>>(
      getRepositoryToken(Apikey),
    );
    examRepository = module.get<Repository<Exam>>(getRepositoryToken(Exam));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQuestionsWithGemini', () => {
    it('should return an error if no apikey found', async () => {
      // Mock apikeyRepository.findOne để trả về null
      jest.spyOn(apikeyRepository, 'findOne').mockResolvedValue(null);

      const result = await service.generateQuestionsWithGemini(
        [],
        1,
        new User(),
        'idea',
      );
      expect(result).toEqual({
        ok: false,
        error: { mainReason: 'Apikey', message: 'Please update your apikey' },
      });
    });

    it('should return an error if exam not found', async () => {
      // Mock apikeyRepository.findOne để trả về api key
      jest
        .spyOn(apikeyRepository, 'findOne')
        .mockResolvedValue({ apikey: 'test-apikey' } as Apikey);
      // Mock examRepository.findOne để trả về null
      jest.spyOn(examRepository, 'findOne').mockResolvedValue(null);

      const result = await service.generateQuestionsWithGemini(
        [],
        1,
        new User(),
        'idea',
      );

      expect(result).toEqual({
        ok: false,
        error: { mainReason: 'Exam', message: 'Exam not found' },
      });
    });

    it('should return an error if exam already have enough questions', async () => {
      // Mock apikeyRepository.findOne để trả về api key
      jest
        .spyOn(apikeyRepository, 'findOne')
        .mockResolvedValue({ apikey: 'test-apikey' } as Apikey);
      // Mock examRepository.findOne để trả về exam với đủ số lượng câu hỏi
      jest.spyOn(examRepository, 'findOne').mockResolvedValue({
        numberQuestions: 2,
        questions: [{ content: 'Câu hỏi 1' }, { content: 'Câu hỏi 2' }],
      } as Exam);

      const result = await service.generateQuestionsWithGemini(
        [],
        1,
        new User(),
        'idea',
      );
      expect(result).toEqual({
        ok: false,
        error: {
          mainReason: 'Exam',
          message: 'Exam already have enough questions',
        },
      });
    });

    it('should generate questions successfully', async () => {
      // mock exam
      const mockExam = {
        id: 1,
        name: 'Exam 1',
        content: 'Content 1',
        numberQuestions: 2,
        questions: [],
      } as Exam;
      //mock user
      const mockUser = new User();
      // Mock apikeyRepository.findOne để trả về api key
      jest
        .spyOn(apikeyRepository, 'findOne')
        .mockResolvedValue({ apikey: 'test-apikey' } as Apikey);
      // Mock examRepository.findOne để trả về exam
      jest.spyOn(examRepository, 'findOne').mockResolvedValue(mockExam);
      // Mock GoogleGenerativeAI để trả về câu hỏi
      (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest
                .fn()
                .mockResolvedValue(
                  '```json[{"content": "Câu hỏi 1"}, {"content": "Câu hỏi 2"}]```',
                ),
            },
          }),
        }),
      }));
      // Mock apikeyRepository.save để trả về api key
      jest.spyOn(apikeyRepository, 'save').mockResolvedValue({} as Apikey);

      const result = await service.generateQuestionsWithGemini(
        [],
        1,
        mockUser,
        'idea',
      );
      expect(result).toEqual({
        ok: true,
        questions: [{ content: 'Câu hỏi 1' }, { content: 'Câu hỏi 2' }],
      });
    });

    it('should handle errors during question generation', async () => {
      // Mock apikeyRepository.findOne để trả về api key
      jest
        .spyOn(apikeyRepository, 'findOne')
        .mockResolvedValue({
          apikey: 'AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y',
        } as Apikey);
      // Mock examRepository.findOne để trả về exam
      jest.spyOn(examRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: 'Exam 1',
        content: 'Content 1',
        numberQuestions: 2,
        questions: [],
      } as Exam);

      // Mock GoogleGenerativeAI để throw error
      (GoogleGenerativeAI as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      const result = await service.generateQuestionsWithGemini(
        [],
        1,
        new User(),
        'idea',
      );
      expect(result).toEqual({
        ok: false,
        error: {
          mainReason: 'Server',
          message: 'Server error, please try again later',
        },
      });
    });
  });
});
