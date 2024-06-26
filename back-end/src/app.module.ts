import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/postgresql.module';
import { AuthModule } from './modules/auth/auth.module';
import { getConfiguration } from './modules/common/config/config';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/upload/upload.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { PostModule } from './modules/post/post.module';
import { ExamModule } from './modules/exam/exam.module';
import { QuestionModule } from './modules/question/question.module';
import { AnswerModule } from './modules/answer/answer.module';
import { ResultModule } from './modules/result/result.module';
import { ApikeyModule } from './modules/openai/openai.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [getConfiguration],
    }),
    FirebaseModule.forRoot({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      appId: process.env.FIREBASE_APP_ID,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    UploadModule,
    UserModule,
    PostModule,
    ExamModule,
    QuestionModule,
    AnswerModule,
    ResultModule,
    ApikeyModule,
    AdminModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
