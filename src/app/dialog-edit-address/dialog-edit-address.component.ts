import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { FirebaseService } from '../services/FirebaseService';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss'],
})
export class DialogEditAddressComponent {
  firebaseService!: FirebaseService;
  user: User = new User();
  userID!: string;
  loading = false;

  constructor(public dialogRef: MatDialogRef<DialogEditAddressComponent>) {
    this.firebaseService = inject(FirebaseService);
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
    const userRef = this.firebaseService.getUserDocRef(this.userID);
    await updateDoc(userRef, {
      address: this.user.address,
      zipCode: this.user.zipCode,
      city: this.user.city,
    });
    this.loading = false;
    this.dialogRef.close();
  }
}
