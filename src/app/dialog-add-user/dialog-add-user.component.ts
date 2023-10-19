import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  setDoc,
  collectionData,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss'],
})
export class DialogAddUserComponent {
  private firestore: Firestore = inject(Firestore);
  user = new User();
  birthDate!: Date;
  // userList: any;
  // users$!: Observable<any>;

  constructor() {
    // const userProfileCollection = this.getUsersColRef();
    // this.users$ = collectionData(userProfileCollection) as Observable<any>;
  }

  async saveUser() {
    this.user.birthDate = this.birthDate?.getTime();
    this.addUser(this.user);
    // setDoc(doc(this.firestore, 'users', 'user1'), {
    //   name: 'Philipp',
    // });
    // this.userList = onSnapshot(this.getUsersColRef(), (list) => {
    //   list.forEach((user) => {
    //     console.log(user);
    //   });
    // });
    // this.userList();
    // const userProfileCollection = this.getUsersColRef();
    // this.users$ = collectionData(userProfileCollection) as Observable<any>;
    // this.users$.subscribe((user) => console.log(user));
  }

  async addUser(user: User) {
    await addDoc(this.getUsersColRef(), user.toJson())
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log(docRef);
      });
  }

  getUsersColRef() {
    return collection(this.firestore, 'users');
  }

  getUserDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
