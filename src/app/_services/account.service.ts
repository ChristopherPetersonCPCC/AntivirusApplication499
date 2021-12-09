import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, ScanHistory } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public report: Observable<String>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/addUserNow`, user);
    }

    getAll(user: User) {
        const formData: FormData = new FormData();
        formData.append('name', user.userName);
        return this.http.post<ScanHistory[]>(`${environment.apiUrl}/getScanHistory`, formData);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(user: User) {
        return this.http.put(`${environment.apiUrl}/update`, user)
            .pipe(map(x => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return x;
            }));
    }

    upload(file: File, user: User){
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('name', user.userName);
        return this.http.post<ScanHistory>(`${environment.apiUrl}/upload`, formData);
    }

}
