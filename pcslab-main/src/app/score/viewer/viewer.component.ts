import {AfterViewInit, Component, HostBinding} from '@angular/core';
import {PoolService} from "../../services/pool.service";
import {StorageService} from "../../services/storage.service";
import {PcsetService} from "../../services/pcset.service";
import {FileService} from "../../services/viewer/file.service";
import {INote} from "pitchclassjs/dist/PitchClass/pitch";
import {VerovioService} from "../../services/viewer/verovio.service";
import {tap} from "rxjs/operators";
import {NoteSelectService} from "../../services/viewer/note-select.service";
import {INoteElement} from "../../interfaces/noteElement";
import {
  fillSingleNoteActiveByThis,
  fillSingleNoteStandardByThis
} from "./jqueryDomManipulation";

declare const $: any;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass']
})
export class ViewerComponent implements AfterViewInit{

  @HostBinding('attr.class') hostClass = 'app-body';
  svg;
  zoom = 60;
  page = 1;
  pages: number;
  loading = true;
  activePool = {name: ''};
  elementList: INoteElement[] = [];
  inputError = {error: false, errorMessage: ''};
  filesList = [];
  activeFile = {id: ''};
  elementListAsSet = null;

  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  vx = 0;
  vy = 0;
  dragActive = false;
  noteCoordinates = [];
  constructor(
    private verovioService: VerovioService,
    private poolService: PoolService,
    private storage: StorageService,
    private setsService: PcsetService,
    private files: FileService,
    private noteSelectService: NoteSelectService
  ) {
    /*this.getActivePool();
    this.getFileList();
    this.getActiveFile();
    this.getSelectedNoteElements();
    this.getVirtualSet();*/
  }


  getActivePool() {
    this.poolService.getActivePool().subscribe((pool) => this.activePool = pool);
  }

  getFileList() {
    this.files.getFiles().subscribe((list) => this.filesList = list);
  }

  getActiveFile()  {
    this.files.getActiveFile().subscribe((file) => this.activeFile = file);
  }

  getSelectedNoteElements() {
    this.storage.select('notes-selected-elements', [])
      .pipe(
        tap(elementList => this.noteSelectService.resetVirtualPcset(elementList))
      ).subscribe(el => this.elementList = el);
  }

  getVirtualSet() {
    this.storage.select('sets-overview-virtual', []).subscribe((set) => this.elementListAsSet = set[0].set);
  }

  clearNotes() {
    this.elementList = [];
    this.storage.set('notes-selected-elements', []);
    this.elementListAsSet = null;
    $('.note').attr('fill', '#000');
  }

  scaling(add) {
    this.zoom = this.verovioService.getZoomLevel(add, this.zoom);
    this.verovioService.setRenderingOptions(this.zoom);
    this.svg = this.verovioService.renderPage(this.page);
    this.loadSVG();
  }

  openFile(element) {
    this.storage.set('active-file', element);
    this.loadPage();
  }

  addToPoolSet(virtual = false) {
    const storeKey = this.poolService.getStoreKey(virtual);
    const {noteIDs, pitchClassList} = this.setsService.getIDSet(this.elementList);
    const out = this.setsService.addPCS(pitchClassList, storeKey, noteIDs, true, virtual);
    if (out && out.hasOwnProperty('error')) {
      this.inputError = out as IPCSInputError;
    }
  }

  paging(forward) {
    this.page = this.verovioService.getPage(forward, this.page, this.pages);
    this.svg = this.verovioService.renderPage(this.page);
    this.loadSVG();
  }

  loadSVG() {
    const ngThis = this;
    // Sorry that I'm using jquery... I don't see a way how to bind events to angular innerhtml in the proper way...
    this.verovioService.initSvgOnLoad(this.svg, this, this.elementList);
    $('.note').click(function (e) {
      ngThis.noteClick(e, this, ngThis);
    });
  }

  isClickedNoteInNoteElementList(ngThis, event) {
    return ngThis.elementList.reduce((state, element) => element.id === event.currentTarget.id ? true : state, false)
  }

  filterClickedNoteFromNoteElementList(ngThis, event) {
    ngThis.elementList = ngThis.elementList.filter((d) => d.id !== event.currentTarget.id);
  }

  addClickedNoteToNoteElementList(ngThis, event) {
    const note: INote = ngThis.verovioService.getNote(event.currentTarget.id);
    ngThis.elementList.push(note);
  }

  noteClick(event, $this, ngThis) {
    if (this.isClickedNoteInNoteElementList(ngThis, event)) {
      this.filterClickedNoteFromNoteElementList(ngThis, event);
      fillSingleNoteStandardByThis($this);
    } else {
      this.addClickedNoteToNoteElementList(ngThis, event);
      fillSingleNoteActiveByThis($this);
    }
    this.addToPoolSet(true);
    this.storage.set('notes-selected-elements', ngThis.elementList);
  }



  loadPage() {
    this.verovioService.loadPage().then(() => {
      this.pages = this.verovioService.pages;
      this.verovioService.setRenderingOptions(this.zoom);
      this.svg = this.verovioService.renderPage(this.page);
      this.loading = false;
      this.loadSVG();
    });

  }

  selectAllInCoordinates() {
    console.log('select');

    this.noteCoordinates.forEach((note) => {

      console.log(this.x1, this.y1, this.x2, this.y2, note.offset.top, note.offset.left, note.id);
      if (note.offset.left > this.x1 &&
        note.offset.left < this.x2 &&
        note.offset.top > this.y1 &&
        note.offset.top < this.y2) {
        this.noteClick({currentTarget: {id: note.id}}, '#' + note.id, this);
      }
    });
  }

  activateDragSelect() {

    const ngThis = this;
    $('#musicwrap').mousedown(function (e) {
      if (!e.shiftKey) {
        return false;
      }
      e.preventDefault();
      console.log(e);
      ngThis.dragActive = true;
      ngThis.x1 = e.pageX;
      ngThis.y1 = e.pageY;
      console.log(e.pageX, e.pageY);
      $(this).on('mousemove', function (ev) {
        ngThis.vx = ev.pageX;
        ngThis.vy = ev.pageY;
      });
    }).mouseup(function (e) {
      if (!e.shiftKey) {
        return false;
      }
      $(this).off('mousemove');
      e.preventDefault();
      console.log(e);
      ngThis.x2 = e.pageX;
      ngThis.y2 = e.pageY;
      ngThis.vx = 0;
      ngThis.vy = 0;
      ngThis.dragActive = false;

      console.log(e.pageX, e.pageY);
      ngThis.selectAllInCoordinates();
    })

  }


  ngAfterViewInit() {
    //this.loadPage();
    //this.activateDragSelect();
  }

}
