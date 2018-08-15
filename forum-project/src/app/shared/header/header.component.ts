import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../../components/auth/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog (): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}