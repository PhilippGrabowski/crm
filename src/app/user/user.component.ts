import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;
  userData: string[] = ['select', 'lastName', 'firstName', 'email'];
  dataSource!: any;
  selection!: any;
  readyToRemoveUser = false;
  showData = new FormControl('');
  showDataList = ['phone', 'birthDate', 'age', 'address', 'zipCode', 'city'];
  userExists = false;
  columns = new FormControl('');
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  clickedRows = new Set<User>();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.userProfileCollection = this.getUsersColRef();
    this.dataSource = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
  }

  /**
   * The ngOnInit function initializes the component by subscribing to changes in the
   * userProfileCollection, transforming the data, setting up the MatTableDataSource and SelectionModel,
   * sorting and paginating the data source, and checking for existing users
   */
  ngOnInit() {
    collectionData(this.userProfileCollection).subscribe(
      (data) => (
        this.transformData(data),
        (this.dataSource = new MatTableDataSource(data)),
        (this.dataSource.sort = this.sort),
        (this.dataSource.paginator = this.paginator),
        this.checkExistingUsers(data)
      )
    );
  }

  /**
   * The function "opendialog()" opens a dialog box to add a user
   */
  opendialog() {
    this.dialog.open(DialogAddUserComponent);
  }

  /**
   * The function transforms data by setting default values for missing properties in each user object
   * @param {any[]} data - The `data` parameter is an array of objects.
   * Each object represents a user and contains properties such as `phone`, `age`, `address`, `zipCode`, and `city`
   */
  transformData(data: any[]) {
    data.forEach((user) => {
      this.transformDate(user);
      if (!user.phone) {
        user.phone = 'N/A';
      }
      if (!user.age) {
        user.age = 'N/A';
      }
      if (!user.address) {
        user.address = 'N/A';
      }
      if (!user.zipCode) {
        user.zipCode = 'N/A';
      }
      if (!user.city) {
        user.city = 'N/A';
      }
    });
  }

  /**
   * The function transforms a given user's birth date from a timestamp format to a localized date format
   * @param {any} user - The "user" parameter is an object that represents a user. It is expected to have a "birthDate" property,
   * which is a string representing a date in the format "YYYY-MM-DD"
   */
  transformDate(user: any) {
    if (user.birthDate) {
      let timestamp = user.birthDate;
      user.birthDate = new Date(timestamp).toLocaleString('de-De', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } else {
      user.birthDate = 'N/A';
    }
  }

  /**
   * The function "showColumns" updates the "userData" array by adding additional columns based on the values provided in the "showData" variable
   */
  showColumns() {
    this.userData = ['select', 'lastName', 'firstName', 'email'];
    if (this.showData.value && this.showData.value.length > 0) {
      let columns = this.showData.value?.toString().split(',');
      if (columns) {
        this.userData = this.userData.concat(columns);
      }
    }
  }

  /**
   * The function applies a filter to a data source based on the value of an input element and resets the paginator to the first page if available
   * @param {Event} event - The event parameter is an object that represents the event that triggered the filter
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * The function `announceSortChange` announces the current sorting state, either the direction of the sort or if the sorting has been cleared
   * @param {Sort} sortState - Sort state is an object that contains information about the current sorting state
   * It has a property called "direction" which represents the sorting direction (e.g. ascending or descending)
   */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * The function checks if all items in a selection are selected
   * @returns a boolean value. If the number of selected items is equal to the total number of rows, it returns true. Otherwise, it returns false.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * The function toggles the selection of all rows in a data source
   * @returns If `this.isAllSelected()` returns `true`, then the function will clear the selection and return nothing. If `this.isAllSelected()` returns `false`,
   * then the function will select all rows in the data source and return nothing
   */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /**
   * The function returns a label for a checkbox based on the row position and selection status
   * @param [row] - The `row` parameter is an optional object that contains a `position` property, which represents the position of a row in a table or list
   * @returns a string.
   */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /**
   * The function "openUserDetails" adds a user to a set of clicked rows and navigates to a user details page for each clicked row
   * @param {User} row - The parameter "row" is of type "User", which represents a single user object
   */
  openUserDetails(row: User) {
    this.clickedRows.add(row);
    this.clickedRows.forEach((row) => {
      this.router.navigateByUrl('/user/' + row.userID);
    });
  }

  /**
   * The function checks if there are selected users and sets a flag indicating if they can be removed
   */
  checkToRemoveableUser() {
    if (this.selection.selected.length > 0) {
      this.readyToRemoveUser = true;
    } else {
      this.readyToRemoveUser = false;
    }
  }

  /**
   * The `removeUser` function removes selected users from the Firestore database
   */
  async removeUser() {
    if (this.selection && this.selection.selected.length > 0) {
      this.selection.selected.forEach(async (row: { userID: string }) => {
        await deleteDoc(doc(this.firestore, 'users', row.userID));
      });
    }
    this.readyToRemoveUser = false;
  }

  /**
   * The function checks if there are existing users by checking the length of the data array
   * @param {any[]} data - The parameter "data" is an array of any type of data
   */
  checkExistingUsers(data: any[]) {
    this.userExists = data.length < 1 ? false : true;
  }

  /**
   * The function returns a reference to the "users" collection in Firestore
   * @returns a reference to the "users" collection in Firestore
   */
  getUsersColRef() {
    return collection(this.firestore, 'users');
  }
}
