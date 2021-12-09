import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User, ScanHistory } from '@app/_models';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    scanhistories = null;
    user: User;

    constructor(private accountService: AccountService) {
      this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.accountService.getAll(this.user)
            .pipe(first())
            .subscribe(scanhistories => this.scanhistories = scanhistories);
    }
}
