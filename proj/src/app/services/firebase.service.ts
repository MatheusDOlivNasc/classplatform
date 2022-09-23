import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private afd: AngularFirestore,
    private afs: AngularFireStorage
  ) { }

  /* Firebase */
  save(module: string, doc: any) {
    doc.id == '' ? doc.id = this.afd.createId() : doc.id = doc.id;
    return this.afd.collection(module).doc(doc.id).set(doc, { merge: true })
  }
  read(module: string, param?: { 'order': any, 'search': any } | any): any | Observable<any[]> {
    if (param) {
      return this.afd.collection(module, ref => {
        if (param.search) {
          if (param.order) {
            return ref.where(param.search.data, '==', param.search.value).orderBy(param.order)
          } else {
            return ref.where(param.search.data, '==', param.search.value)
          }
        }
        if (param.order) {
          return ref.orderBy(param.order)
        }
        else {
          return ref
        }
      }).valueChanges()
    } else {
      return this.afd.collection(module).valueChanges()
    }
  }
  delete(module: string, id: string) {
    return this.afd.collection(module).doc(id).delete()
  }
  setUser(email: string) {
    return this.read('User', {'search': {'data': 'email', 'value': email}})
  }
  getImage(way: string) {
    return this.afs.ref(way).getDownloadURL()
  }
}
