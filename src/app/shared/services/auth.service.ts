import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { Observable } from 'rxjs/internal/Observable';
import { AppUser } from '../models/app-user';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.default.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.user$ = afAuth.authState;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut();
  }

  get appUser$(): Observable<AppUser | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user) return this.userService.get(user.uid).valueChanges();
        return of(null);
      })
    );
  }
}
