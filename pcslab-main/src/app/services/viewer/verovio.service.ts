import {Injectable} from '@angular/core';
import {WebWorkerService} from 'ngx-web-worker';
import {parseXML} from "../../shared/domparser";
import {StorageService} from "../storage.service";
import {FileService} from "./file.service";
import {parseMEI} from "../../webworker/parseMEI";
import {
  fillSingleNoteActiveById,
  fillSingleNoteStandardByThis,
  setCursorPointerForEveryNote
} from "../../score/viewer/jqueryDomManipulation";
import {switchMap} from "rxjs/operators";

declare const verovio: any;
declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class VerovioService {
  notes;
  vrvToolkit;
  options;
  pages: number;
  activeFile;
  fileContent;
  noteCoordinates = [];

  zoomSteps = 10;

  page = 1;

  constructor(private webWorkerService: WebWorkerService, private storage: StorageService, private fileService: FileService) {
    this.fileService.getActiveFile().pipe(
      switchMap(file => this.fileService.getFileContent(file))
    ).subscribe((fileContent) => this.fileContent = fileContent);
    this.vrvToolkit = new verovio.toolkit();
  }

  loadPage() {
    return this.webWorkerService.run(parseMEI, {
      mei: this.fileContent, xmldom: parseXML(this.fileContent)
    }).then((result) => {
      this.vrvToolkit.loadData(result.mei);
      this.notes = result.obj;
      this.pages = this.vrvToolkit.getPageCount();
    });
  }
  
  getPage(forward, page, pages) {
    if (forward > 0) {
      if (page + 1 <= pages) {
        page += 1;
      }
    } else {
      if (page - 1 > 0) {
        page -= 1;
      }
    }
    return page;
  }

  getZoomLevel(add: -1 | 1, zoom: number) {
    if (add > 0) {
      zoom + this.zoomSteps > 150 ? zoom : zoom + this.zoomSteps;
    } else {
      zoom = zoom - this.zoomSteps < 1 ? zoom : zoom - this.zoomSteps;
    }
    return zoom;
  }

  armClickableNotes(elementList) {
    setCursorPointerForEveryNote();
    elementList.forEach((element) => fillSingleNoteActiveById(element.id));
  }

  initSvgOnLoad(svg, ngThis, elementList) {
    this.armClickableNotes(elementList);
    this.noteCoordinates = [];
    $('.note').each(function (i) {
      this.noteCoordinates.push({id: $(this).attr('id'), offset: $(this).offset()});
    });
  }

  setRenderingOptions(scale: number = 60) {
    this.options = {
      pageWidth: 2600,
      pageHeight: 2000,
      scale,
      noFooter: 'true',
      noHeader: 'true',
      adjustPageHeight: 'true',
      breaks: 'auto',
    };
    this.vrvToolkit.setOptions(this.options);
    this.vrvToolkit.redoLayout();
  }

  getNote(id) {
    console.log(this.notes, id);
    const filteredNotes = this.notes.filter(note => note.attributes['xml:id'] === +id)[0];
    console.log(filteredNotes);
    const pname = filteredNotes.attributes.pname;
    const oct = filteredNotes.attributes.oct;
    const dur = 0;
    let accid = [];
    if (filteredNotes.hasOwnProperty('children') && filteredNotes.children[0].tagName === 'accid') {
      accid = [...filteredNotes.children[0].attributes.accid.split('')];
    }
    return {id, pname, oct, dur, accid};
  }

  renderPage(page) {
    return this.vrvToolkit.renderPage(page);
  }
}
