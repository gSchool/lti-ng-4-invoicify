import { Component, OnInit, HostListener } from '@angular/core';
import { fadeInAnimation } from 'app/animations/fade-in.animation';
import { MatDialog } from '@angular/material';
import { DataService } from 'app/data.service';
import { DeleteConfirmComponent } from 'app/delete-confirm/delete-confirm.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [fadeInAnimation]
})

export class ContactComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  contacts: any[];
  originalContacts: any[];
  searchText: string = '';
  filterBy: string = '';

  constructor(private dataService: DataService, public dialog: MatDialog, private sanitizer:DomSanitizer) {}

  ngOnInit() { this.getContacts(); }
  
  setSkypeNumber(n){
    return this.sanitizer.bypassSecurityTrustUrl(`skype://+1${n}?call`);
  }

  getContacts() {
    this.dataService.getRecords("contact")
      .subscribe(
        contacts => this.contacts = contacts,
        error => this.errorMessage = <any>error);
    this.dataService.getRecords("contact")
      .subscribe(
        contacts => this.originalContacts = contacts,
        error => this.errorMessage = <any>error);
  }

  @HostListener('input') onInput(){
    if(this.filterBy=='fName'){
      this.contacts = this.originalContacts.filter(c=> c.firstName.toLowerCase().includes(this.searchText.toLowerCase()));
    } 
    else if(this.filterBy=='lName'){
      this.contacts = this.originalContacts.filter(c=> c.lastName.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    else if(this.filterBy=='email'){
      this.contacts = this.originalContacts.filter(c=> c.email.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    else if(this.filterBy=='companyName'){
      this.contacts = this.originalContacts.filter(c=> c.client.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    else if(this.filterBy=='phoneNumber'){
      this.contacts = this.originalContacts.filter(c=> c.phoneNumber.toLowerCase().includes(this.searchText.toLowerCase()));
    }
    else if(this.filterBy=='type'){
      this.contacts = this.originalContacts.filter(c=> c.type.toLowerCase().includes(this.searchText.toLowerCase()));
    }
  }

  idSort(contacts: any) {
    contacts.sort(function(a,b) {
      return a.id - b.id;
    })
  }

  firstNameSort(contacts: any){
    contacts.sort(function(a,b) {
      let nameA = a.firstName.toLowerCase(), nameB = b.firstName.toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;
      return 0;
    })
  }

  lastNameSort(contacts: any){
    contacts.sort(function(a,b) {
      let nameA = a.lastName.toLowerCase(), nameB = b.lastName.toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;
      return 0;
    })
  }

  companySort(contacts: any){
    contacts.sort(function(a,b) {
      let nameA = a.client.toLowerCase(), nameB = b.client.toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;
      return 0;
    })
  }  

  deleteContact(id:number) {
    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord("contact", id)
          .subscribe(
            contact => {this.successMessage = "Record(s) deleted successfully"; this.getContacts(); },
            error => this.errorMessage = <any>error);
      }
    })
  }

}