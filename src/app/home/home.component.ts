import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, ScanHistory } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    fileName: string;
    uploadProgress: number;
    selectedFiles?: FileList;
    currentFile?: File;
    message = '';
    errorMsg = '';
    report?: ScanHistory;
    bool: boolean;


    constructor(private accountService: AccountService, private http: HttpClient, private router: Router) {
        this.user = this.accountService.userValue;
    }

    onFileSelected(event: any): void{
      this.selectedFiles = event.target.files;
    }

    upload(): void {
    this.errorMsg = '';

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.user = this.accountService.userValue;

        this.accountService.upload(this.currentFile, this.user).subscribe(report => this.report = report)
        this.bool = true;
      }

      this.selectedFiles = undefined;
    }
  }
}
