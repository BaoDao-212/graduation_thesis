import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Apikey } from 'src/entities/apikey.entity';
import { createError } from '../common/utils/createError';
import {
  GenerateQuestionsOutput,
  GenerateReviewOutput,
  OpenAiKeyInput,
  OpenAiKeyOutput,
  prompt0,
  prompt1,
  prompt11,
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
        console.log(error);
        return createError('Input', error);
      }
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

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
          user: {
            id: currentUser.id,
          },
        },
        relations: ['user', 'questions'],
      });

      if (!exam) {
        return createError('Exam', 'Exam not found');
      }
      if (exam.questions.length == exam.numberQuestions)
        return createError('Exam', 'Exam already have enough questions');
      const count= exam.numberQuestions - exam.questions.length<20 ? exam.numberQuestions - exam.questions.length : 20;
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
        data = `${prompt0}${prompt1} ${count} ${prompt11} ${exam.name}(${exam.content}) focus on the following contents: ${idea} ${prompt2}`;
      } else {
        data = `${prompt1} ${count} ${prompt11} ${exam.name}(${exam.content}) focus on the following contents: ${idea} ${prompt2}`;
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
      const text =await response.text();
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
      if (result.detailResult.length / result.exam.questions.length < 0.8) {
        return createError('Result', 'Result not enough question to evaluate');
      }
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
        console.log(text);
        let match = text.match(/```json([\s\S]*?)```/);
        let extractedString = match && match[1] ? match[1].trim() : '';
        result.review = extractedString;
        await this.resultRepo.save(result);
        return {
          ok: true,
          review: extractedString,
        };
      } catch (error) {
        apikey.apikey = '';
        await this.apikeyRepo.save(apikey);
        return createError('ER', 'Please check your apikey');
      }
    } catch (error) {
      console.log(error);

      return createError('Server', 'Server error, please try again later');
    }
  }
}
