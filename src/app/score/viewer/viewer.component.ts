import {AfterViewInit, Component, HostBinding} from '@angular/core';
import {PoolService} from "../../services/pool/pool.service";
import {StorageService} from "../../services/storage.service";
import {FileService} from "../../services/files/file.service";
import {VerovioService} from "../../services/viewer/verovio.service";
import {INoteElement} from "../../interfaces/noteElement";
import {setRenderedScore} from "./jqueryDomManipulation";
// TODO: Duplicate File strategy!
declare const $: any;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.sass']
})
export class ViewerComponent implements AfterViewInit {

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
    private poolService: PoolService,
    private verovioService: VerovioService,
    private storage: StorageService,
    private files: FileService
  ) {
    this.getActivePool();
    this.getFileList();
    this.getActiveFile();
    this.getSelectedNoteElements();
    this.getVirtualSet();
  }


  getActivePool() {
    this.poolService.getActivePool().subscribe((pool) => this.activePool = pool);
  }

  getFileList() {
    this.files.getFiles().subscribe((list) => this.filesList = list);
  }

  getActiveFile() {
    this.files.getActiveFile().subscribe((file) => this.activeFile = file);
  }

  getSelectedNoteElements() {
    this.storage.select('notes-selected-elements', [])
      .pipe(
        //tap(elementList => this.noteSelectService.resetVirtualPcset(elementList))
      ).subscribe(el => this.elementList = el);
  }

  getVirtualSet() {
    this.storage.select('sets-overview-virtual', [{set: []}]).subscribe((set) => this.elementListAsSet = set[0].set);
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
    this.poolService.addNoteSelectionToPool(virtual, this.elementList);
  }

  paging(forward) {
    this.page = this.verovioService.getPage(forward, this.page, this.pages);
    this.svg = this.verovioService.renderPage(this.page);
    this.loadSVG();
  }

  loadSVG() {
    const ngThis = this;
    // Sorry that I'm using jquery... I don't see a way how to bind events to angular innerhtml in the proper way...
    setRenderedScore(this.svg);
    this.verovioService.initSvgOnLoad(this.elementList);
    $('.note').click(function (e) {
      ngThis.verovioService.noteClick(e, this, ngThis.elementList);
    });
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


  /**
   //TODO: Improve Drag select...
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

  }*/


  ngAfterViewInit() {
    this.loadPage();
    //this.activateDragSelect();
  }

}
