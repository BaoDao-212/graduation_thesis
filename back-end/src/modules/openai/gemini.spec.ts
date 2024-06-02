import { Test, TestingModule } from '@nestjs/testing';
import { Express } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApikeyController } from './openai.resolver';
import { ApikeyService } from './openai.service';
import { User } from 'src/entities/user.entity';

describe('ExamController', () => {
  let controller: ApikeyController;
  let apikeyService: ApikeyService;

  const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      username: '',
      createdAt: undefined,
      updatedAt: undefined,
      hashPassword: function (): Promise<void> {
          throw new Error('Function not implemented.');
      },
      checkPassword: function (password: string): Promise<boolean> {
          throw new Error('Function not implemented.');
      }
  };

  
const mockFiles: Array<Express.Multer.File> = [
    {
        fieldname: 'file',
        originalname: 'document.docx',
        encoding: 'utf8',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: Buffer.from('test content'),
        size: 1024,
        stream: null,
        destination: null,
        filename: null,
        path: null,
    },
];


  const mockGeneratedQuestions = [
    'What is the capital of France?',
    'Who wrote the book "Pride and Prejudice"?',
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApikeyController],
      providers: [
        {
          provide: ApikeyService,
          useValue: {
            generateQuestionsWithGemini: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<ApikeyController>(ApikeyController);
    apikeyService = module.get<ApikeyService>(ApikeyService);
  });

  it('should generate questions successfully', async () => {
    const idea = 'Create questions based on this document';
    const examId = 123;

    jest.spyOn(apikeyService, 'generateQuestionsWithGemini').mockResolvedValue(mockGeneratedQuestions);

    const result = await controller.generateQuestions(mockUser, mockFiles, { idea }, examId);

    expect(result).toEqual(mockGeneratedQuestions);
    expect(apikeyService.generateQuestionsWithGemini).toHaveBeenCalledWith(
      mockFiles,
      examId,
      mockUser,
      idea,
    );
  });

  it('should throw an error if no files are provided', async () => {
    const idea = 'Create questions based on this document';
    const examId = 123;

    try {
      await controller.generateQuestions(mockUser, [], { idea }, examId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toContain('No files provided');
    }
  });

  it('should throw an error if invalid examId is provided', async () => {
    const idea = 'Create questions based on this document';
    const examId = -1; // Invalid examId

    try {
      await controller.generateQuestions(mockUser, mockFiles, { idea }, examId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      expect(error.message).toContain('Invalid exam ID');
    }
  });

  it('should throw an error if an error occurs from Gemini API', async () => {
    const idea = 'Create questions based on this document';
    const examId = 123;

    jest.spyOn(apikeyService, 'generateQuestionsWithGemini').mockRejectedValue(
      new HttpException('Error from Gemini API', HttpStatus.INTERNAL_SERVER_ERROR),
    );

    try {
      await controller.generateQuestions(mockUser, mockFiles, { idea }, examId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.message).toContain('Error from Gemini API');
    }
  });
});