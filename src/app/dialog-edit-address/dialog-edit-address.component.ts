import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss'],
})
export class DialogEditAddressComponent {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;
  user: User = new User();
  userID!: string;
  loading = false;

  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>) {
    this.userProfileCollection = this.getUsersColRef();
  }

  /**
   * The function "saveAddress" is an asynchronous function that sets the loading state to true, collects user data, and then calls the "editAddress" function
   */
  async saveAddress() {
    this.loading = true;
    this.editAddress();
  }

  /**
   * The `editAddress` function updates the address, zip code, and city of a user in a database
   */
  async editAddress() {
    const userRef = this.getUserDocRef('users', this.userID);
    await updateDoc(userRef, {
      address: this.user.address,
      zipCode: this.user.zipCode,
      city: this.user.city,
    });
    this.loading = false;
    this.dialogRef.close();
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
   * @param {string} colId - The `colId` parameter is a string that represents the ID of the collection in Firestore
   * @param {string} docId - The `docId` parameter is a string that represents the ID of a specific document in a collection
   * @returns a document reference
   */
  getUserDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
