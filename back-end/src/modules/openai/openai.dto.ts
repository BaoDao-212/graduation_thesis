import { ApiProperty } from '@nestjs/swagger';
import { Answer } from 'src/entities/answer.entity';
import { Post, PostStatus } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class OpenAiKeyInput {
  @ApiProperty({ description: 'apikey' })
  openAiKey: string;
}
export class OpenAiKeyOutput extends CoreOutput {}

export class AnswerOutPut extends CoreOutput {
  @ApiProperty({ description: 'answer' })
  answer?: Answer;
}
export class AnswerListOutput extends CoreOutput {
  @ApiProperty({ description: 'answers' })
  answers?: Answer[];
}
export class GenerateAnswerInput {
  @ApiProperty({ description: 'file' })
  file?: any;
  @ApiProperty({ description: 'idea' })
  idea?: string;
}
export class GenerateQuestionsOutput extends CoreOutput {
  @ApiProperty({ description: 'questions' })
  questions?: any;
}
export class GenerateReviewInput {
  @ApiProperty({ description: 'questionIncorrect' })
  questionIncorrect?: number[];
  @ApiProperty({ description: 'questionCorrect' })
  questionCorrect?: number[];
}
export class GenerateReviewOutput extends CoreOutput {
  @ApiProperty({ description: 'eview' })
  review?: string;
}
export const prompt0 = ' From the contents of the file above,';
export const prompt1 = ` Create a set of about 20 questions with answers in json format in English and add it to the file. let me download it. The questions will range from easy(0), medium(1), difficult(2) and very difficult(3). Difficult and very difficult level questions require more in-depth knowledge
The exam content is to test understanding and application of`;
export const prompt2 = `
With output of the questions in json format:
[
  {
      "content": "Which Linux command is used to display a list of PCI devices recognized by the kernel?",
      "answers": [
          { "content": "lsusb", "isCorrect": false },
          { "content": "lspci", "isCorrect": true },
          { "content": "uname -a", "isCorrect": false }
        ],
      "level": 1,
        "explanation": "lspci: A command-line tool in Linux designed to display detailed information about PCI (Peripheral Component Interconnect) devices recognized by the kernel, including ID, name, manufacturer, and various other parameters."
      }
    ]
    Note: The question must have at least 4-5 options, and there should be explanations for the correct answers.
`;
export const prompt3 = 'I have completed the ';
export const prompt4 = ' exam. I answered the following questions correctly:';
export const prompt5 = 'and the following questions incorrectly: ';
export const prompt6 =
  '. Please analyze and evaluate my work in detail, then suggest ways for me to improve how I can improve my knowledge and results.';
export const prompt7 = `
With output of the questions in json format:
  {
    analysis_and_evaluation: {
      correctly_answered_questions: [
        'Demonstrated a strong understanding of core Kubernetes concepts such as Pods, Services, HPA, DaemonSets, Jobs, and Deployments.',
        'Understood the role of ConfigMaps in configuring applications and the use of readiness probes to ensure availability.',
        'Grasped the purpose of Namespaces for resource isolation and Secrets for securely storing sensitive information.',
        'Your understanding of Rolling Updates and Ingress controllers highlights your knowledge of deployment strategies and external access.',
      ],
      incorrectly_answered_questions: [
        {
          content: 'Primary function of Kubernetes',
          evaluation:
            'You need to understand its main role is to orchestrate and manage containerized applications throughout their lifecycle, not just deploy them.',
        },
        {
          content: 'Role of a Deployment',
          evaluation:
            'You should understand that Deployments are responsible for managing and updating Pod configurations, ensuring the desired state of your application.',
        },
        {
          content: 'Scaling Pods in a Deployment',
          evaluation:
            'You should be familiar with the specific command kubectl scale deployment <deployment-name> --replicas=<desired-number> for scaling.',
        },
      ],
    },
    suggestions: [
      {
        content: 'Review core Kubernetes concepts thoroughly',
        description:
          'Ensure a solid understanding of basic components like Pods, Services, Deployments, and how they interact.',
      },
      {
        content: 'Practice using Kubernetes commands',
        description:
          'Get hands-on experience with kubectl commands to manage Kubernetes objects, perform deployments, updates, scaling, and troubleshooting.',
      },
      {
        content: 'Study Kubernetes documentation',
        description:
          'Refer to the official Kubernetes documentation and tutorials for detailed explanations, examples, and best practices.',
      },
    ],
    links: [
      {
        content: 'Kubernetes Documentation',
        url: 'https://kubernetes.io/docs/home/',
      },
      {
        content: 'Kubernetes Community',
        url: 'https://kubernetes.io/community/',
      },
      {
        content: 'Kubernetes Tutorials',
        url: 'https://kubernetes.io/docs/tutorials/',
      },
    ],
  }
  Note: Analysis and evaluation must include detailed analysis of correct and incorrect answers, along with suggestions for improvement and related resources, but must be concise and not lengthy.
`;


