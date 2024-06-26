import { Injectable } from '@nestjs/common';
import { DeleteFileInput, DeleteFilesInput } from './dto/UploadFile.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UploadService {
  constructor(private readonly firebaseService: FirebaseService) {}
  uploadFile(file: Express.Multer.File, storagePath: string) {
    return this.firebaseService.uploadFile(file, storagePath);
  }
  uploadFiles(files: Express.Multer.File[], storagePath: string) {
    return this.firebaseService.uploadFiles(files, storagePath);
  }

  deleteFile(input: DeleteFileInput) {
    return this.firebaseService.deleteFile(input.storagePath);
  }
  deleteFiles(input: DeleteFilesInput) {
    return this.firebaseService.deleteFiles(input.storagePaths);
  }
}
 