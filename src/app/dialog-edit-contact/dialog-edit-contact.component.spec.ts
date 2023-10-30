import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditContactComponent } from './dialog-edit-contact.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getFirestore } from 'firebase/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogEditContactComponent', () => {
  let component: DialogEditContactComponent;
  let fixture: ComponentFixture<DialogEditContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [DialogEditContactComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    });
    fixture = TestBed.createComponent(DialogEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
