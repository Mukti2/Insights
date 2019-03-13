/*********************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';


@Component({
  selector: 'about-show-popup',
  templateUrl: './about-show-popup.html',
  styleUrls: ['./about-show-popup.css']
})
export class AboutDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<AboutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close('no');
  }
  closeShowDetailsDialog(): void {
    this.dialogRef.close('no');
  }
  onHealthClick(): void {
    this.dialogRef.close('yes');
  }

}
