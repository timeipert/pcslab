import { Component, OnInit } from '@angular/core';
import {FileService} from "../../services/files/file.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent {

  success = false;

  constructor(private filesService: FileService) {
  }

  uploadFile(files) {
    this.success = this.filesService.handleFileUpload(files);
  }
}
