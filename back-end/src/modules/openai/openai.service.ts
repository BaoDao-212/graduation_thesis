import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Apikey } from 'src/entities/apikey.entity';
import { createError } from '../common/utils/createError';
import { GenerateQuestionsOutput, OpenAiKeyInput, OpenAiKeyOutput, prompt1, prompt2 } from './openai.dto';
import OpenAI from 'openai';
import { Exam, ExamStatus } from 'src/entities/exam.entity';

import {
  createRuns,
  createThread,
  getMessages,
  getStatus,
} from './openai.method';
import fs from 'fs';
import { GoogleGenerativeAI, RequestOptions } from '@google/generative-ai';
@Injectable()
export class ApikeyService {
  constructor(
    @InjectRepository(Apikey) private readonly apikeyRepo: Repository<Apikey>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
  ) {}

  async updateApiKeyOpenAI(
    currentUser: User,
    input: OpenAiKeyInput,
  ): Promise<OpenAiKeyOutput> {
    try {
      const { openAiKey } = input;
      console.log(openAiKey);
      const openai = new OpenAI({
        apiKey: openAiKey,
      });
      let assistant;
      try {
        const myAssistants = await openai.beta.assistants.list({
          limit: 20,
        });
        console.log(myAssistants.data);

        if (
          myAssistants.data.filter(
            (assistant) => assistant.name === 'Assistant for Q&A system',
          ).length === 0
        ) {
          console.log(11);
          assistant = await openai.beta.assistants.create({
            name: 'Assistant for Q&A system',
            instructions: `You are a thoughtful virtual assistant who specializes in designing and building Q&A systems. 
              Created with the goal of helping teachers and developers build high-quality content, you continuously update your knowledge to provide the latest and most engaging question sets. 
              With input being a data set about a field of cloud computing and information technology or a certain topic in the field of information technology
            
              Please create a question set with the following requirements:
              [
                  {
                      "content": "Which Linux command is used to display a list of PCI devices recognized by the kernel?",
                      "answers": [
                          { "content": "lsusb", "isCorrect": false },
                          { "content": "lspci", "isCorrect": true },
                          { "content": "uname -a", "isCorrect": false }
                        ],
                        "explainCorrectAnswer": "lspci: A command-line tool in Linux designed to display detailed information about PCI (Peripheral Component Interconnect) devices recognized by the kernel, including ID, name, manufacturer, and various other parameters."
                      }
                    ]
                    Note: The question must have at least 4-5 options, and there should be explanations for the correct answers.
                    `,
            model: 'gpt-3.5-turbo',
            tools: [{ type: 'code_interpreter' }],
          });
        } else {
          assistant = myAssistants.data.filter(
            (assistant) => assistant.name == 'Assistant for Q&A system',
          )[0];
        }
      } catch (error) {
        return createError('Input', 'OpenAI key not valid');
      }

      const apikey = await this.apikeyRepo.findOne({
        where: {
          user: {
            id: currentUser.id,
          },
        },
      });
      console.log(apikey);
      console.log(assistant);

      if (apikey) {
        apikey.apikey = openAiKey;
        apikey.assistantId = assistant.id;
        await this.apikeyRepo.save(apikey);
      } else {
        const newApikey = await this.apikeyRepo.create({
          apikey: openAiKey,
          user: currentUser,
          assistantId: assistant.id,
        });
        console.log(newApikey);
        await this.apikeyRepo.save(newApikey);
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //TODO: tạo ra một bộ đề kết hợp gemini api của google
  async generateQuestions(
    file: any,
    examId: number,
    currentUser: User,
  ): Promise<any> {
    try {
      if (!file) {
        return createError('File', 'File not found');
      }
      if (
        file.mimetype !==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
        return createError('File', 'File not valid');

      const exam = await this.examRepo.findOne({
        where: {
          id: examId,
          status: ExamStatus.ACTIVE,
        },
      });

      if (!exam) {
        return createError('Exam', 'Exam not found');
      }

      const apikey = await this.apikeyRepo.findOne({
        where: {
          user: {
            id: currentUser.id,
          },
        },
        relations: {
          user: true,
        },
      });

      if (!apikey) return createError('Apikey', 'Please update your apikey');
      const openai = new OpenAI({
        apiKey: apikey.apikey,
      });
      const assistant = await openai.beta.assistants.retrieve(
        apikey.assistantId,
      );
      let file1;
      try {
        const blob = new Blob([file.buffer], {
          type: file.mimetype,
        });
        const f = new File([blob], file.originalname);
        file1 = await openai.files.create({
          file: f,
          purpose: 'assistants',
        });
        const thread = await createThread(openai, file1.id);

        console.log(thread);
        let count = 0;
        while (count === 0) {
          const run = await createRuns(openai, {
            threadId: thread.id,
            assistant_id: assistant.id,
          });
          console.log(run);
          let runStatus;
          do {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await getStatus(openai, {
              runId: run.id,
              threadId: thread.id,
            });
            console.log(runStatus);
            if (runStatus.status === 'failed') {
              return createError(
                'File',
                'Error sending too many requests in a short time',
              );
            }
          } while (runStatus.status !== 'completed');
          let message = await getMessages(openai, {
            threadId: thread.id,
            runId: run.id,
          });
          console.log(message);

          message = message
            ? JSON.parse(message)
                .map(({ content, answers, explainCorrectAnswer }) => ({
                  content,
                  answers,
                  explainCorrectAnswer,
                }))
                .filter(
                  (element) =>
                    element.content !== undefined &&
                    element.answers !== undefined,
                )
            : '';

          console.log(message);

          let json;
          if (message) {
            json = message;
          }

          if (json) {
            console.log(json);

            return {
              ok: true,
            };
          } else {
            count = 0;
          }
        }
      } catch (error) {
        return createError('File', 'File not valid');
      }
    } catch (error) {
      return createError('Server', 'Please update your apikey');
    }
  }
  //TODO: tạo ra một bộ đề kết hợp assistant của openai
  async generateQuestionsWithGemini(
    files: Express.Multer.File[],
    examId: number,
    currentUser: User,
  ): Promise<GenerateQuestionsOutput> {
    try {
      if (!files || files.length === 0) {
        return createError('File', 'File not found');
      }
  
      const exam = await this.examRepo.findOne({
        where: {
          id: examId,
          status: ExamStatus.ACTIVE,
          user: {
            id: currentUser.id,
          },
        },
        relations: ['user'],
      });
  
      if (!exam) {
        return createError('Exam', 'Exam not found');
      }
  
      const genAI = new GoogleGenerativeAI('AIzaSyCLob5fQm05BU4c1VDnCknr6tmxRnylz6Y');
      const generationConfig = {
        stopSequences: ['red'],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
      };
  
      const model = genAI.getGenerativeModel(
        { model: 'gemini-1.5-pro-latest' },
        generationConfig as RequestOptions
      );
  
      const fileToGenerativePart = (buffer: Buffer, mimeType: string) => ({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType,
        },
      });
  
      const imageParts = files.map((file) => fileToGenerativePart(file.buffer, file.mimetype));
      const res = await model.generateContent(`${prompt1}${exam.name}${prompt2}`);
      const response = await res.response;
      const text = response.text().replace(/^```json|\```$/g, '');
      const questions = JSON.parse(text);
  
      return {
        ok: true,
        questions,
      };
    } catch (error) {
      return createError('Server', 'Server error, please try again later');
    }
  }
  
}
// }
