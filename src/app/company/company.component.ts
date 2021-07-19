import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'
import { fadeInAnimation } from '../animations/fade-in.animation';
import {HostListener } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  animations: [fadeInAnimation]
})
export class CompanyComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  companies: any[];
  originalCompanies: any[];
  searchText: string = '';
  filterBy: string = '';

  constructor (private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit() { this.getCompanies(); }

  getCompanies() {
    this.dataService.getRecords("company")
      .subscribe(
        companies => this.companies = companies,
        error =>  this.errorMessage = <any>error);

    this.dataService.getRecords("company")
      .subscribe(
        companies => this.originalCompanies = companies,
         error => this.errorMessage = <any>error);
  }

  @HostListener('input') onInput(){
    if(this.filterBy=='companyName'){
      this.companies = this.originalCompanies.filter(c=> c.name.toLowerCase().includes(this.searchText.toLowerCase()));
    } 
  }

  deleteCompany(id:number) {
    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dataService.deleteRecord("company", id)
          .subscribe(
            company => {this.successMessage = "Record(s) deleted succesfully"; this.getCompanies(); },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

  idSort(companies: any) {
    companies.sort(function(a,b) {
      return a.id - b.id;
    })
  }

  companySort(companies: any){
    companies.sort(function(a,b) {
      let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if(nameA < nameB) return -1;
      if(nameA > nameB) return 1;
      return 0;
    })
  }
}
