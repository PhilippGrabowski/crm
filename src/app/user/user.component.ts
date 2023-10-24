import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  collectionData,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  userProfileCollection: any;
  userData: string[] = ['select', 'lastName', 'firstName', 'email'];
  users!: any;
  dataSource!: any;
  selection!: any;
  showData = new FormControl('');
  showDataList = ['phone', 'birthDate', 'age', 'address', 'zipCode', 'city'];
  userExists = false;
  columns = new FormControl('');
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {
    this.userProfileCollection = this.getUsersColRef();
  }

  ngOnInit() {
    onSnapshot(this.userProfileCollection, (items: any) => {
      items.forEach((item: any) => {
        const userRef = this.getUserDocRef('users', item.id);
        updateDoc(userRef, { userID: item.id });
      });
    });
    collectionData(this.userProfileCollection).subscribe(
      (changes) => (
        this.transformData(changes),
        (this.dataSource = new MatTableDataSource(changes)),
        (this.selection = new SelectionModel(true, [])),
        (this.dataSource.sort = this.sort),
        (this.dataSource.paginator = this.paginator),
        this.checkExistingUsers(changes)
      )
    );
  }

  opendialog() {
    this.dialog.open(DialogAddUserComponent);
  }

  transformData(data: any[]) {
    data.forEach((user) => {
      this.transformDate(user);
    });
  }

  transformDate(user: any) {
    if (user.birthDate && user.birthDate !== 'N/A') {
      let timestamp = user.birthDate;
      user.birthDate = new Date(timestamp).toLocaleString('de-De', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  }

  showColumns() {
    this.userData = ['select', 'lastName', 'firstName', 'email'];
    if (this.showData.value && this.showData.value.length > 0) {
      let columns = this.showData.value?.toString().split(',');
      if (columns) {
        this.userData = this.userData.concat(columns);
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: { position: number }): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  removeUser() {}

  checkExistingUsers(data: any[]) {
    this.userExists = data.length < 1 ? false : true;
  }

  getUsersColRef() {
    return collection(this.firestore, 'users');
  }

  getUserDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
