import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Apikey } from 'src/entities/apikey.entity';
import { createError } from '../common/utils/createError';
import {
  GenerateQuestionsOutput,
  GenerateReviewInput,
  GenerateReviewOutput,
  OpenAiKeyInput,
  OpenAiKeyOutput,
  prompt0,
  prompt1,
  prompt2,
  prompt3,
  prompt4,
  prompt5,
  prompt6,
  prompt7,
} from './openai.dto';
import { Exam, ExamStatus } from 'src/entities/exam.entity';
import { uploadFile } from './gemini.methods';

import { GoogleGenerativeAI, RequestOptions } from '@google/generative-ai';
import { Result } from 'src/entities/result.entity';

@Injectable()
export class ApikeyService {
  constructor(
    @InjectRepository(Apikey) private readonly apikeyRepo: Repository<Apikey>,
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(Result) private readonly resultRepo: Repository<Result>,
  ) {}
  async updateApiKeyOpenAI(
    currentUser: User,
    input: OpenAiKeyInput,
  ): Promise<OpenAiKeyOutput> {
    try {
      const { openAiKey } = input;
      console.log(openAiKey);
      try {
        const genAI = new GoogleGenerativeAI(openAiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const res = await model.generateContent([{ text: 'Hello' }]);
        const apikey = await this.apikeyRepo.findOne({
          where: {
            user: {
              id: currentUser.id,
            },
          },
        });
        if (apikey) {
          apikey.apikey = openAiKey;
          await this.apikeyRepo.save(apikey);
        } else {
          const newApikey = await this.apikeyRepo.create({
            apikey: openAiKey,
            user: currentUser,
          });
          await this.apikeyRepo.save(newApikey);
        }
        return {
          ok: true,
        };
      } catch (error) {
        return createError('Input', 'API key not valid');
      }
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // async updateApiKeyOpenAI(
  //   currentUser: User,
  //   input: OpenAiKeyInput,
  // ): Promise<OpenAiKeyOutput> {
  //   try {
  //     const { openAiKey } = input;
  //     console.log(openAiKey);
  //     const openai = new OpenAI({
  //       apiKey: openAiKey,
  //     });
  //     let assistant;
  //     try {
  //       const myAssistants = await openai.beta.assistants.list({
  //         limit: 20,
  //       });
  //       console.log(myAssistants.data);

  //       if (
  //         myAssistants.data.filter(
  //           (assistant) => assistant.name === 'Assistant for Q&A system',
  //         ).length === 0
  //       ) {
  //         console.log(11);
  //         assistant = await openai.beta.assistants.create({
  //           name: 'Assistant for Q&A system',
  //           instructions: `You are a thoughtful virtual assistant who specializes in designing and building Q&A systems.
  //             Created with the goal of helping teachers and developers build high-quality content, you continuously update your knowledge to provide the latest and most engaging question sets.
  //             With input being a data set about a field of cloud computing and information technology or a certain topic in the field of information technology

  //             Please create a question set with the following requirements:
  //             [
  //                 {
  //                     "content": "Which Linux command is used to display a list of PCI devices recognized by the kernel?",
  //                     "answers": [
  //                         { "content": "lsusb", "isCorrect": false },
  //                         { "content": "lspci", "isCorrect": true },
  //                         { "content": "uname -a", "isCorrect": false }
  //                       ],
  //                       "explainCorrectAnswer": "lspci: A command-line tool in Linux designed to display detailed information about PCI (Peripheral Component Interconnect) devices recognized by the kernel, including ID, name, manufacturer, and various other parameters."
  //                     }
  //                   ]
  //                   Note: The question must have at least 4-5 options, and there should be explanations for the correct answers.
  //                   `,
  //           model: 'gpt-3.5-turbo',
  //           tools: [{ type: 'code_interpreter' }],
  //         });
  //       } else {
  //         assistant = myAssistants.data.filter(
  //           (assistant) => assistant.name == 'Assistant for Q&A system',
  //         )[0];
  //       }
  //     } catch (error) {
  //       return createError('Input', 'OpenAI key not valid');
  //     }

  //     const apikey = await this.apikeyRepo.findOne({
  //       where: {
  //         user: {
  //           id: currentUser.id,
  //         },
  //       },
  //     });
  //     console.log(apikey);
  //     console.log(assistant);

  //     if (apikey) {
  //       apikey.apikey = openAiKey;
  //       apikey.assistantId = assistant.id;
  //       await this.apikeyRepo.save(apikey);
  //     } else {
  //       const newApikey = await this.apikeyRepo.create({
  //         apikey: openAiKey,
  //         user: currentUser,
  //         assistantId: assistant.id,
  //       });
  //       console.log(newApikey);
  //       await this.apikeyRepo.save(newApikey);
  //     }
  //     return {
  //       ok: true,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return createError('Server', 'Lỗi server, thử lại sau');
  //   }
  // }
  //TODO: tạo ra một bộ đề kết hợp gemini api của google
  // async generateQuestions(
  //   file: any,
  //   examId: number,
  //   currentUser: User,
  // ): Promise<any> {
  //   try {
  //     if (!file) {
  //       return createError('File', 'File not found');
  //     }
  //     if (
  //       file.mimetype !==
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  //     )
  //       return createError('File', 'File not valid');

  //     const exam = await this.examRepo.findOne({
  //       where: {
  //         id: examId,
  //         status: ExamStatus.ACTIVE,
  //       },
  //     });

  //     if (!exam) {
  //       return createError('Exam', 'Exam not found');
  //     }

  //     const apikey = await this.apikeyRepo.findOne({
  //       where: {
  //         user: {
  //           id: currentUser.id,
  //         },
  //       },
  //       relations: {
  //         user: true,
  //       },
  //     });

  //     if (!apikey) return createError('Apikey', 'Please update your apikey');
  //     const openai = new OpenAI({
  //       apiKey: apikey.apikey,
  //     });
  //     const assistant = await openai.beta.assistants.retrieve(
  //       apikey.assistantId,
  //     );
  //     let file1;
  //     try {
  //       const blob = new Blob([file.buffer], {
  //         type: file.mimetype,
  //       });
  //       const f = new File([blob], file.originalname);
  //       file1 = await openai.files.create({
  //         file: f,
  //         purpose: 'assistants',
  //       });
  //       const thread = await createThread(openai, file1.id);

  //       console.log(thread);
  //       let count = 0;
  //       while (count === 0) {
  //         const run = await createRuns(openai, {
  //           threadId: thread.id,
  //           assistant_id: assistant.id,
  //         });
  //         console.log(run);
  //         let runStatus;
  //         do {
  //           await new Promise((resolve) => setTimeout(resolve, 2000));
  //           runStatus = await getStatus(openai, {
  //             runId: run.id,
  //             threadId: thread.id,
  //           });
  //           console.log(runStatus);
  //           if (runStatus.status === 'failed') {
  //             return createError(
  //               'File',
  //               'Error sending too many requests in a short time',
  //             );
  //           }
  //         } while (runStatus.status !== 'completed');
  //         let message = await getMessages(openai, {
  //           threadId: thread.id,
  //           runId: run.id,
  //         });
  //         console.log(message);

  //         message = message
  //           ? JSON.parse(message)
  //               .map(({ content, answers, explainCorrectAnswer }) => ({
  //                 content,
  //                 answers,
  //                 explainCorrectAnswer,
  //               }))
  //               .filter(
  //                 (element) =>
  //                   element.content !== undefined &&
  //                   element.answers !== undefined,
  //               )
  //           : '';

  //         console.log(message);

  //         let json;
  //         if (message) {
  //           json = message;
  //         }

  //         if (json) {
  //           console.log(json);

  //           return {
  //             ok: true,
  //           };
  //         } else {
  //           count = 0;
  //         }
  //       }
  //     } catch (error) {
  //       return createError('File', 'File not valid');
  //     }
  //   } catch (error) {
  //     return createError('Server', 'Please update your apikey');
  //   }
  // }
  //TODO: tạo ra một bộ đề kết hợp assistant của openai
  async generateQuestionsWithGemini(
    files: Express.Multer.File[],
    examId: number,
    currentUser: User,
    idea: string,
  ): Promise<GenerateQuestionsOutput> {
    try {
      const apikey = await this.apikeyRepo.findOne({
        where: {
          user: {
            id: currentUser.id,
          },
        },
      });
      if (!apikey) {
        return createError('Apikey', 'Please update your apikey');
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

      const genAI = new GoogleGenerativeAI(apikey.apikey);
      let fileupload;
      if (files.length == 1)
        fileupload = await uploadFile(files[0], apikey.apikey);
      const generationConfig = {
        stopSequences: ['red'],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
        responseMimeType: 'application/json',
      };

      const model = genAI.getGenerativeModel(
        { model: 'gemini-1.5-pro-latest' },
        generationConfig as RequestOptions,
      );
      let data;
      if (files.length > 0) {
        data = `${prompt0}${prompt1} ${exam.name}(${exam.content}) focus on the following contents: ${idea} ${prompt2}`;
      } else {
        data = `${prompt1} ${exam.name}(${exam.content}) focus on the following contents: ${idea} ${prompt2}`;
      }
      let res;
      if (files.length == 1)
        res = await model.generateContent([
          { text: data },
          {
            fileData: {
              mimeType: fileupload.file,
              fileUri: fileupload.uri,
            },
          },
        ]);
      else res = await model.generateContent([{ text: data }]);

      const response = await res.response;
      const text = response.text();
      let match = text.match(/```json([\s\S]*?)```/);
      let extractedString = match && match[1] ? match[1].trim() : '';
      return {
        ok: true,
        questions: JSON.parse(extractedString),
      };
    } catch (error) {
      console.log(error);

      return createError('Server', 'Server error, please try again later');
    }
  }
  //TODO: đánh giá đề thi
  async reviewExam(
    user: User,
    resultId: number,
  ): Promise<GenerateReviewOutput> {
    try {
      const result = await this.resultRepo.findOne({
        where: {
          id: resultId,
          user: {
            id: user.id,
          },
        },
        relations: {
          detailResult: {
            question: true,
          },
          exam: {
            questions: true,
          },
          user: true,
        },
      });
      if (!result) {
        return createError('Result', 'Result not found');
      }
      if (result.review) {
        return createError('Result', 'Result already reviewed');
      }
      let questionCorrect = [];
      let questionIncorrect = [];
      result.detailResult.forEach((dr) => {
        if (dr.score == 1) {
          questionCorrect.push(dr.question.content);
        } else {
          questionIncorrect.push(dr.question.content);
        }
      });
      let review = '';
      const apikey = await this.apikeyRepo.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
      });
      if (!apikey) {
        return createError('Apikey', 'Please update your apikey');
      }
      const generationConfig = {
        stopSequences: ['red'],
        maxOutputTokens: 200,
        temperature: 0.9,
        topP: 0.1,
        topK: 16,
        responseMimeType: 'application/json',
      };
      const genAI = new GoogleGenerativeAI(apikey.apikey);
      const model = genAI.getGenerativeModel(
        { model: 'gemini-1.5-pro-latest' },
        generationConfig as RequestOptions,
      );
      try {
        const res = await model.generateContent([
          {
            text: `${prompt3} ${result.exam.name}( ${
              result.exam.content
            }) ${prompt4} ${questionCorrect.join(
              ', ',
            )} ${prompt5} ${questionIncorrect.join(
              ', ',
            )} ${prompt6} ${prompt7}`,
          },
        ]);
        const response = await res.response;
        const text = response.text();
        let match = text.match(/```json([\s\S]*?)```/);
        let extractedString = match && match[1] ? match[1].trim() : '';
        result.review = extractedString;
        await this.resultRepo.save(result);
        return {
          ok: true,
          review: extractedString,
        };
      } catch (error) {
        return createError('ER', 'Please check your apikey');
      }
    } catch (error) {
      console.log(error);

      return createError('Server', 'Server error, please try again later');
    }
  }
}
