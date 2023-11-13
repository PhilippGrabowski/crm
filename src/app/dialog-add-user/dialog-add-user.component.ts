import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { FirebaseService } from '../services/FirebaseService';
import { addDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss'],
})
export class DialogAddUserComponent {
  firebaseService!: FirebaseService;
  user = new User();
  birthDate!: Date;
  loading = false;
  inputCheckIds = ['firstNameInput', 'lastNameInput', 'emailInput'];
  allowToAddUser = false;

  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>) {
    this.firebaseService = inject(FirebaseService);
  }

  /**
   * The function saves a user if the condition allows, by setting the loading state to true, collecting user data, and adding the user
   */
  async saveUser() {
    if (this.allowToAddUser) {
      this.loading = true;
      this.collectUserData();
      this.addUser();
    }
  }

  /**
   * The function `addUser` adds a user to a user profile collection in a database and updates the user ID
   */
  async addUser() {
    await addDoc(this.firebaseService.userProfileCollection, this.user.toJson())
      .catch((err) => {
        console.error(err);
      })
      .then((doc: any) => {
        updateDoc(doc, { userID: doc.id });
        this.loading = false;
        this.dialogRef.close();
      });
  }

  /**
   * The function "checkInputs" counts the number of filled inputs and calls the "allowAddUser" function with the count as an argument
   */
  checkInputs() {
    let filledInputs = 0;
    for (let i = 0; i < this.inputCheckIds.length; i++) {
      let input: any = document.getElementById(this.inputCheckIds[i]);
      if (input?.value !== '') {
        filledInputs++;
      }
    }
    this.allowAddUser(filledInputs);
  }

  /**
   * The function "allowAddUser" checks if the number of filled inputs is equal to 3 and sets the "allowToAddUser" variable accordingly
   * @param {number} filledInputs - The parameter "filledInputs" is a number that represents the number of inputs that have been filled by the user
   * (firstname, lastname, email)
   */
  allowAddUser(filledInputs: number) {
    if (filledInputs === 3) {
      this.allowToAddUser = true;
    } else {
      this.allowToAddUser = false;
    }
  }

  /**
   * The function collects user data, including age and birth date
   */
  collectUserData() {
    this.user.age = this.calculateAge();
    this.user.birthDate = this.getTimestamp();
  }

  /**
   * The function returns the timestamp of a birth date if it exists, otherwise it returns ''
   * @returns the timestamp of the birthDate if it is defined, otherwise it is returning the string ''
   */
  getTimestamp() {
    if (this.birthDate !== undefined && this.birthDate !== null) {
      return this.birthDate?.getTime();
    } else {
      return '';
    }
  }

  /**
   * The calculateAge function calculates the age based on the birth date provided
   * @returns the age of a person based on their birth date. If the birth date is not defined, it returns ''
   */
  calculateAge() {
    if (this.birthDate !== undefined && this.birthDate !== null) {
      var ageDifMs = Date.now() - this.birthDate.getTime();
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } else {
      return '';
    }
  }
}
