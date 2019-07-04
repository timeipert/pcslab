import {Injectable} from '@angular/core';
import {StorageService} from "../storage.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  files;
  activeFile$;
  filesMeta$;

  constructor(private storage: StorageService) {
    this.activeFile$ = this.storage.select('active-file', {});
    this.filesMeta$ = this.storage.select('files-meta', []);
    this.getFiles().subscribe(files => this.files = files);
  }

  getFiles() {
    return this.filesMeta$;
  }

  handleFileUpload(files: FileList) {
    const fileToUpload = files.item(0);
    console.log(fileToUpload);
    const reader = new FileReader();
    reader.readAsText(fileToUpload);
    reader.onload = () => {
      const withoutLineBreaks = reader.result.toString().replace(/(?:\r\n|\r|\n)/g, '');
      const mei = withoutLineBreaks.replace(/\s+/g, ' ');
      const id = fileToUpload.lastModified;
      const name = fileToUpload.name;
      if (this.uploadFile(id, name, mei)) {
        return true;
      }
    };
    return true;
  }


  uploadFile(id, name, mei) {
    this.files.push({id, name});
    this.storage.set('files-meta', this.files);
    this.storage.set('file-' + id, mei);
    return true;
  }

  getActiveFile() {
    return this.activeFile$;
  }

  getFileContent(file) {
    return this.storage.select('file-' + file.id, '');
  }

}
