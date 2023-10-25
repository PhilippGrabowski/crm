import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;
  userID!: string;
  user: User = new User();

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.userProfileCollection = this.getUsersColRef();
  }

  /**
   * The ngOnInit function retrieves a user document from Firestore based on the provided user ID and
   * updates the user property with the retrieved data
   */
  ngOnInit(): void {
    this.userID = this.route.snapshot.params['id'];
    const userRef = this.getUserDocRef('users', this.userID);
    onSnapshot(userRef, (doc) => {
      this.user = new User(doc.data());
    });
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

  /**
   * The function "openContactDialog" opens a dialog box and passes user information to it
   */
  openContactDialog() {
    const dialog = this.dialog.open(DialogEditContactComponent);
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userID = this.userID;
  }

  /**
   * The function "openAddressDialog" opens a dialog box and passes user information to it
   */
  openAddressDialog() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userID = this.userID;
  }
}
