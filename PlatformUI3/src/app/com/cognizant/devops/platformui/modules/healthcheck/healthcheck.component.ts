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
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { HealthCheckService } from '@insights/app/modules/healthcheck/healthcheck.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShowDetailsDialog } from '@insights/app/modules/healthcheck/healthcheck-show-details-dialog';


@Component({
  selector: 'app-healthcheck',
  templateUrl: './healthcheck.component.html',
  styleUrls: ['./healthcheck.component.css', './../home.module.css']
})
export class HealthCheckComponent implements OnInit {

  agentsStatusResposne: any;
  agentNodes = [];
  agentToolsIcon = {};
  showContent: boolean = false;
  showThrobber: boolean = false;
  showContentAgent: boolean = false;
  showThrobberAgent: boolean = false;
  serverStatus = [];
  displayedAgentColumns: string[];
  dataComponentColumns: string[];
  servicesColumns: string[];
  agentDataSource = [];
  dataComponentDataSource = [];
  servicesDataSource = [];
  healthResponse: any;
  agentResponse:any;
  agentBacktoTopFlag: boolean = false;
  dataBacktoTopFlag: boolean = false;
  servicesBacktoTopFlag: boolean = false;


  constructor(private healthCheckService: HealthCheckService, private dialog: MatDialog) {
    this.loadAgentCheckInfo();
    this.loadAllHealthCheckInfo();
  }

  ngOnInit() { }

  async loadAgentCheckInfo(){
    try {
      this.showThrobberAgent = true;
      this.showContentAgent = !this.showThrobberAgent;
      this.agentResponse = await this.healthCheckService.loadServerAgentConfiguration();
      console.log(this.agentResponse);
      if (this.agentResponse != null) {
        this.showThrobberAgent = false;
        this.showContentAgent = !this.showThrobberAgent;
        for (var key in this.agentResponse) {
          var element = this.agentResponse[key];
          element.serverName = key;
          if (element.type == 'Agents') {
            this.agentNodes = element.agentNodes;
            this.agentDataSource = this.agentNodes;
          }
        }
        //Displays Back to Top button when Agent table contains more than 20 rows
        if (this.agentDataSource.length > 20) {
          this.agentBacktoTopFlag = true;
        }
        this.displayedAgentColumns = ['category', 'toolName', 'inSightsTimeX', 'status', 'details'];
      }
    }catch (error) {
      this.showContentAgent = false;
      console.log(error);
    }

  }

  async loadAllHealthCheckInfo() {
    try {
      // Loads Agent , Data Component and Services
      this.showThrobber = true;
      this.showContent = !this.showThrobber;
      this.healthResponse = await this.healthCheckService.loadServerHealthConfiguration();
      if (this.healthResponse != null) {
        //console.log(this.healthResponse);
        this.showThrobber = false;
        this.showContent = !this.showThrobber;
        for (var key in this.healthResponse) {
          var element = this.healthResponse[key];
          element.serverName = key;
          if (element.type == 'Service') {
            this.servicesDataSource.push(element);
          } else if (element.type == 'Database') {
            this.dataComponentDataSource.push(element);
          }
        }
       
        //Displays Back to Top button when Data Component table contains more than 20 rows
        if (this.dataComponentDataSource.length > 20) {
          this.dataBacktoTopFlag = true;
        }
        //Displays Back to Top button when Services table contains more than 20 rows
        if (this.servicesDataSource.length > 20) {
          this.servicesBacktoTopFlag = true;
        }

        this.dataComponentColumns = ['serverName', 'ipAddress', 'version', 'status'];
        this.servicesColumns = ['serverName', 'ipAddress', 'version', 'status', 'details'];

      }

    } catch (error) {
      this.showContent = false;
      console.log(error);
    }
  }

  // Displays Show Details dialog box when Details column is clicked
  showDetailsDialog(toolName: string, categoryName: string,pathName: string,detailType:string) {
    var rcategoryName=categoryName.replace(/ +/g, "");
    if (toolName=="-"){
      var filePath="${INSIGHTS_HOME}/logs/"+rcategoryName+"/"+rcategoryName+".log";
      var detailType=categoryName;
    }else {
      var rtoolName=toolName.charAt(0).toUpperCase() + toolName.slice(1).toLowerCase();
      var filePath="${INSIGHTS_HOME}/logs/PlatformAgent/log_"+rtoolName+"Agent.log";
      var detailType=rtoolName;
    }
    let showDetailsDialog = this.dialog.open(ShowDetailsDialog, {
      panelClass: 'healthcheck-show-details-dialog-container',
      height: '500px',
      width: '900px',
      data: { toolName: toolName, categoryName: categoryName, pathName:filePath,detailType:detailType },
    });
  }

  //Transfers focus of Heath Check page as per User's selection
  goToSection(source: string, target: string) {
    // Changes the selected section color in the title
    this.changeSelectedSectionColor(source);
    let element = document.querySelector("#" + target);
    if (element) {
      element.scrollIntoView();
    }
  }

  // Changes the selected section color in the title
  changeSelectedSectionColor(source: string) {
    if (source == 'agentTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('dataCompTxt').style.color = "#0033A0";
      document.getElementById('servicesTxt').style.color = "#0033A0";
    } else if (source == 'dataCompTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('agentTxt').style.color = "#0033A0";
      document.getElementById('servicesTxt').style.color = "#0033A0";
    } else if (source == 'servicesTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('dataCompTxt').style.color = "#0033A0";
      document.getElementById('agentTxt').style.color = "#0033A0";
    }

  }

  //When user clicks on Back to Top button, it scrolls to Health Check page
  goToHealthCheckTitle() {
    let element = document.querySelector("#healthCheckTitle");
    if (element) {
      element.scrollIntoView();
    }
  }

}




