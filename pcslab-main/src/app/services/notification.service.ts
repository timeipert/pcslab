import { Injectable} from '@angular/core';
import {SnackbarService} from "ngx-snackbar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: SnackbarService) { }

  showSuccess(msg: string): void {
    this.snackBar.add({
      msg,
      timeout: 5000
    });
  }

  showError(msg: string): void {
    this.snackBar.add({
      msg: `Oh no! ${msg}`,
      timeout: 5000,
      customClass: 'error-message-snackbar',
      action: {
        text: null,
      }
    }); }
}
