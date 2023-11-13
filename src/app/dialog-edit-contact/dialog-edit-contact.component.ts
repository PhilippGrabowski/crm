import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { FirebaseService } from '../services/FirebaseService';
import { updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dialog-edit-contact',
  templateUrl: './dialog-edit-contact.component.html',
  styleUrls: ['./dialog-edit-contact.component.scss'],
})
export class DialogEditContactComponent implements OnInit {
  firebaseService!: FirebaseService;
  user: User = new User();
  userID!: string;
  birthDate!: Date;
  loading = false;
  inputCheckIds = ['firstNameInput', 'lastNameInput', 'emailInput'];
  allowToAddUser = true;

  constructor(public dialogRef: MatDialogRef<DialogEditContactComponent>) {
    this.firebaseService = inject(FirebaseService);
  }
  ngOnInit(): void {
    if (this.user.birthDate !== '') {
      this.birthDate = this.getBirthDate();
    }
  }

  /**
   * The saveContact function checks if adding a user is allowed, and if so, sets the loading state to true,
   * collects user data, and calls the editContact function
   */
  async saveContact() {
    if (this.allowToAddUser) {
      this.loading = true;
      this.collectUserData();
      this.editContact();
    }
  }

  /**
   * The `editContact` function updates the contact information of a user in a database and closes a dialog window
   */
  async editContact() {
    const userRef = this.firebaseService.getUserDocRef(this.userID);
    await updateDoc(userRef, {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      birthDate: this.user.birthDate,
      age: this.user.age,
    });
    this.loading = false;
    this.dialogRef.close();
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
   * The function "getBirthDate" returns the birth date of a user as a Date object
   * @returns the birth date of the user
   */
  getBirthDate() {
    let date = new Date(this.user.birthDate);
    return date;
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
