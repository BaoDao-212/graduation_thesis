import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Apikey } from 'src/entities/apikey.entity';
import { Exam } from 'src/entities/exam.entity';
import { User } from 'src/entities/user.entity';
import { Result } from 'src/entities/result.entity';
import { Repository } from 'typeorm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApikeyService } from './openai.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as mammoth from 'mammoth';
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

// Mock uploadFile function
jest.mock('./openai.service', () => ({
  ...jest.requireActual('./openai.service'),
  uploadFile: jest.fn().mockResolvedValue({
    file: 'application/pdf',
    uri: 'gs://bucket-name/file-name.pdf',
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
        .mockResolvedValue({ apikey: 'AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y' } as Apikey);
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
        .mockResolvedValue({ apikey: 'AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y' } as Apikey);
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

    it('should generate questions successfully with no file', async () => {
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
        .mockResolvedValue({ apikey: 'AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y' } as Apikey);
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
    jest.mock('./openai.service', () => ({
      ...jest.requireActual('./openai.service'),
      uploadFile: jest.fn().mockResolvedValue({
        file: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uri: 'gs://bucket-name/file-name.docx',
        buffer: fs.readFileSync('sample.docx'), // Add the buffer here
      }),
    }));
    // Mock mammoth
    jest.mock('mammoth', () => {
      return {
        convertToHtml: jest.fn(),
      };
    });

    // Mock fs
    jest.mock('fs', () => {
      return {
        writeFileSync: jest.fn(),
      };
    });

    it('should generate questions successfully with file', async () => {
      // Mock exam
      const mockExam = {
        id: 1,
        name: 'Exam 1',
        content: 'Content 1',
        numberQuestions: 2,
        questions: [],
      } as Exam;
  
      // Mock user
      const mockUser = new User();
  
      // Mock apikeyRepository.findOne to return an API key
      jest
        .spyOn(apikeyRepository, 'findOne')
        .mockResolvedValue({ apikey: 'AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y' } as Apikey);
  
      // Mock examRepository.findOne to return an exam
      jest.spyOn(examRepository, 'findOne').mockResolvedValue(mockExam);
  
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
  
      // Mock apikeyRepository.save to return an API key
      jest.spyOn(apikeyRepository, 'save').mockResolvedValue({} as Apikey);
  
      // Create a mock .docx file
      const fileBuffer = Buffer.from('Dummy content');
      const files = [{ buffer: fileBuffer } as Express.Multer.File];

      // Mock mammoth.convertToHtml to return expected HTML
      jest.spyOn(mammoth, 'convertToHtml').mockImplementation(() =>
        Promise.resolve({ value: '<p>Dummy content</p>', messages: [] })
      );

      // Call the service method
      const result = await service.generateQuestionsWithGemini(
        files,
        1,
        mockUser,
        'idea',
      );
  
      // Expectations
      expect(result).toEqual({
        ok: true,
        questions: [{ content: 'Câu hỏi 1' }, { content: 'Câu hỏi 2' }],
      });
  
      // Cleanup (no file system operations necessary here since we are not writing to disk)
    });
    it('should handle errors during question generation', async () => {
      // Mock apikeyRepository.findOne để trả về api key
      jest.spyOn(apikeyRepository, 'findOne').mockResolvedValue({
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
