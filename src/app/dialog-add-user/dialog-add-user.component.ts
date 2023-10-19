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

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss'],
})
export class DialogAddUserComponent {
  private firestore: Firestore = inject(Firestore);
  user = new User();
  birthDate!: Date;
  userNames: any;

  constructor() {}

  async saveUser() {
    this.user.birthDate = this.birthDate?.getTime();
    // this.addUser(this.user);
    // setDoc(doc(this.firestore, 'names', '#1'), {
    //   name: 'Philipp',
    // });
    this.userNames = onSnapshot(
      this.getUserDocRef('users', 'w8TujdRo5dsUJ8MAcyNM'),
      (name) => {
        console.log(name);
      }
    );
    this.userNames();
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
