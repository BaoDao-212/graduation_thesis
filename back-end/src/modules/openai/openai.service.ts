import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import { Apikey } from 'src/entities/apikey.entity';
import { createError } from '../common/utils/createError';
import { OpenAiKeyInput, OpenAiKeyOutput } from './openai.dto';
import OpenAI from 'openai';
import { Exam, ExamStatus } from 'src/entities/exam.entity';

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
        where: { id: currentUser.id },
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
  //TODO: tạo ra một bộ đề kết hợp assistant của openai
  async generateQuestions(
    file: Express.Multer.File,
    examId: number,
  ): Promise<any> {
    try {
      const exam = await this.examRepo.findOne({
        where: {
          id: examId,
          status: ExamStatus.ACTIVE,
        },
      });
      if (!exam) {
        return createError('Exam', 'Exam not found');
      }
      // gửi file lên openai để tạo câu hỏi
      console.log(file.mimetype);
      console.log(file.buffer);
      console.log(file.originalname);
      
      // code here
      return {
        ok: true,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
