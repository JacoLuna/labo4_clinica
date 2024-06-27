import { Injectable } from '@angular/core';
import {
  Auth,
  User as FireUser,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateCurrentUser,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Colecciones, DatabaseService } from './database.service';
import { Persona } from '../classes/persona';
import { initializeApp } from 'firebase/app';
// import { ErrorCodes, Exception } from '../utils/clases/exception';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //#region Properties, Subjects and Observables
  private _usuarioEnSesionSub = new BehaviorSubject<Persona | null>(null);
  public usuarioEnSesionObs = this._usuarioEnSesionSub.asObservable();

  public get UsuarioEnSesion(): Persona | null {
    return this._usuarioEnSesionSub.getValue();
  }
  public set UsuarioEnSesion(value: Persona | null) {
    if (value) {
      sessionStorage.setItem('usuario', JSON.stringify(value));
      let fireUser: FireUser;
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        fireUser = currentUser;
        sessionStorage.setItem('fireUser', JSON.stringify(fireUser));
      } else {
        fireUser = JSON.parse(sessionStorage.getItem('fireUser')!);
      }
    } else {
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('fireUser');
      if (this.auth.currentUser)
        this.auth.signOut();
    }
    this._usuarioEnSesionSub.next(value);
  }
  //#endregion

  constructor(private auth: Auth, private db: DatabaseService) {}

  /**
   * Registra un usuario con correo y contraseña en `Firebase Authentication`
   *  y guarda sus datos en la colección `users` en `Firestore`.
   *
   * @async
   * @param usuario - El objeto Persona con los datos a guardar en `Firestore`.
   * @param contr - La contraseña que será registrada en `Firebase Authentication`.
   * @returns El ID del doc donde se guardó el usuario en la colección `users` en `Firestore`.
   *
   * @throws Un Fire error traducido a un mensaje comprensible para el usuario.
   */
  async registrarFireAuth(usuario: Persona, contr: string): Promise<string> {
    try {
      const ssFireUser = sessionStorage.getItem('fireUser');
      const fireUserViejo: FireUser | null = ssFireUser ? JSON.parse(ssFireUser) : null;

      // await this.db.buscarUsuarioPorDni(usuario.dni) // Tira Error si no encuentra el DNI
      //   .catch((error: Exception) => {
      //     if (error.code !== ErrorCodes.DniNoRegistrado) // Si el error no es sobre el DNI no encontrado, lo tira de nuevo.
      //       throw error;
      //   });

      const authInst = !fireUserViejo ? this.auth : getAuth(
        initializeApp({
          projectId: 'lab4lunajaco',
          appId: '1:85267814802:web:00d2f43a8038fa48f2c94b',
          storageBucket: 'lab4lunajaco.appspot.com',
          apiKey: 'AIzaSyCFt1PlKZDi1248k-EjAhUaI521JeFKMsw',
          authDomain: 'lab4lunajaco.firebaseapp.com',
          messagingSenderId: '85267814802',
        },"Secondary"));
      await createUserWithEmailAndPassword(authInst, usuario.correo, contr);

      const docId = await this.db.subirDoc(Colecciones.Personas, usuario, true);
      usuario.id = docId;

      if (!fireUserViejo)
        this.UsuarioEnSesion = usuario;

      return docId;
    } catch (error: any) {
      error.message = this.parsearError(error);
      throw error;
    }
  }

  /**
   * Ingresa un usuario a la sesión de `Firebase Authentication` y asigna el objeto Persona a la propiedad local.
   *
   * @async
   * @param email - El correo para intentar ingresar a `Firebase Authentication`.
   * @param contr - La contraseña para intentar ingresar a `Firebase Authentication`.
   *
   * @throws Un Fire error traducido a un mensaje comprensible para el usuario.
   */
  async ingresarFireAuth(email: string, contr: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, contr);
      const objUsuario = await this.db.buscarPersonaPorCorreo(this.auth.currentUser?.email!)
      console.log(objUsuario);
      this.UsuarioEnSesion = objUsuario;
    } catch (error: any) {
      error.message = this.parsearError(error);
      throw error;
    }
  }

  /**
   * Define la propiedad `UsuarioEnSesion` como nula.
   */
  signOut() {
    this.UsuarioEnSesion = null;
  }

  /**
   * Traduce un Fire error a un mensaje comprensible para el usuario.
   *
   * @param error - El error arrojado por Firebase.
   * @returns El mensaje de error traducido.
   */
  private parsearError(error: any): string {
    let message: string = error.message;
    switch (error.code) {
      case `auth/invalid-credential`:
        message = `La dirección de correo o contraseña no son válidos.`;
        break;
      case `auth/invalid-email`:
        message = `La dirección de correo no es válida.`;
        break;
      case `auth/user-not-found`:
        message = `Esta dirección de correo no está registrada.`;
        break;
      case `auth/wrong-password`:
        message = `La contraseña es incorrecta.`;
        break;
      case `auth/email-already-in-use`:
        message = `Esta dirección de correo ya está registrada.`;
        break;
      case `auth/weak-password`:
        message = `La contraseña es muy débil.`;
        break;
      case `auth/operation-not-allowed`:
        message = `Esta operación de autentificación no está permitida.`;
        break;
    }

    return message;
  }
}
