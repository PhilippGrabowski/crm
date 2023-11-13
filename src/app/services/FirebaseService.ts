import { OnInit, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { User } from 'src/models/user.class';

export class FirebaseService {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;

  constructor() {
    this.userProfileCollection = this.getUsersColRef();
  }

  /**
   * The function returns a reference to the "users" collection in Firestore
   * @returns a reference to the "users" collection in Firestore
   */
  getUsersColRef() {
    return collection(this.firestore, 'users');
  }

  /**
   * The function returns a document reference for a specific document in a collection
   * @param {string} docId - The `docId` parameter is a string that represents the ID of a specific document in a collection
   * @returns a document reference
   */
  getUserDocRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }

  async deleteUser(userId: string) {
    await deleteDoc(doc(this.firestore, 'users', userId));
  }
}
