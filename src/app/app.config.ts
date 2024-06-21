import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'lab4lunajaco',
        appId: '1:85267814802:web:00d2f43a8038fa48f2c94b',
        storageBucket: 'lab4lunajaco.appspot.com',
        apiKey: 'AIzaSyCFt1PlKZDi1248k-EjAhUaI521JeFKMsw',
        authDomain: 'lab4lunajaco.firebaseapp.com',
        messagingSenderId: '85267814802',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
  ],
};


// importProvidersFrom(
//   AngularFireModule.initializeApp({
//     apiKey: "AIzaSyCFt1PlKZDi1248k-EjAhUaI521JeFKMsw",
//     authDomain: "lab4lunajaco.firebaseapp.com",
//     projectId: "lab4lunajaco",
//     storageBucket: "lab4lunajaco.appspot.com",
//     messagingSenderId: "85267814802",
//     appId: "1:85267814802:web:00d2f43a8038fa48f2c94b"
//   })
// ),