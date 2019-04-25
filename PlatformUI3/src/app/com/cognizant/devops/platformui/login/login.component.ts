/*******************************************************************************
 * Copyright 2019 Cognizant Technology Solutions
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
 ******************************************************************************/

import { Component, OnInit } from '@angular/core';
import { LoginService } from '@insights/app/login/login.service';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { LogService } from '@insights/common/log-service';
import { DataSharedService } from '@insights/common/data-shared-service';
import { ImageHandlerService } from '@insights/common/imageHandler.service';

export interface ILoginComponent {
  createAndValidateForm(): void;
  userAuthentication(): void;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LogService, DatePipe]
})
export class LoginComponent implements OnInit, ILoginComponent {

  self;
  logMsg: string;
  isLoginError: boolean;
  isDisabled: boolean;
  showThrobber: boolean = false;
  cookies: string;
  username: string;
  password: string;
  imageSrc: string = "";
  resourceImage: any;
  loginForm: FormGroup;
  imageAlt: String = "";

  constructor(private loginService: LoginService, private restAPIUrlService: RestAPIurlService,
    private restCallHandlerService: RestCallHandlerService, private cookieService: CookieService,
    private router: Router, private logger: LogService, private dataShare: DataSharedService,
    private datePipe: DatePipe, private imageHandeler: ImageHandlerService) {
    //console.log(" logging in login "); //this.logger.log
    this.getAsyncData();

  }

  ngOnInit() {
    this.createAndValidateForm();
    this.dataShare.storeTimeZone();
    
    //this.deleteAllPreviousCookies();
  }

  public createAndValidateForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  async getAsyncData() {
    try {
      var restCallUrl = this.restAPIUrlService.getRestCallUrl("GET_LOGO_IMAGE");
      this.resourceImage = await this.restCallHandlerService.getJSON(restCallUrl);
      this.dataShare.removeCustomerLogoFromSesssion()
      if (this.resourceImage.data.encodedString.length > 0) {
        this.imageSrc = 'data:image/jpg;base64,' + this.resourceImage.data.encodedString;
        this.imageHandeler.addImage("customer_logo_uploded", this.imageSrc);
        this.dataShare.uploadOrFetchLogo(this.imageSrc);
      } else {
        this.imageSrc = 'icons/svg/landingPage/Insights_Logo.png';
        this.imageAlt = 'Cognizant log';
        this.dataShare.uploadOrFetchLogo("DefaultLogo");
      }

    } catch (error) {
      //console.log(error);
    }
  }

  public userAuthentication(): void {
    //console.log(this.loginForm.value.username);
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
    if (this.username === '' || this.password === '') {
      this.logMsg = '';
    } else {
      var self = this;
      this.isDisabled = true;
      this.showThrobber = true;
      var token = 'Basic ' + btoa(this.username + ":" + this.password);
      this.loginService.loginUserAuthentication(this.username, this.password)
        .then((data) => {
          var grafcookies = data.data;
          if (data.status === 'SUCCESS') {
            self.showThrobber = false;
            var date = new Date();
            //var timeZoneOffset = this.dataShare.convertDateToZone(date.toString());
            //console.log(timeZoneOffset);
            /*const timeZoneOffset = date.getTimezoneOffset();
            var zone = this.datePipe.transform(date, 'ZZZZ')
            var z = zone.slice(3, zone.length);
            var utcDate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ssZ', '+0000');//getUTCDate() new Date(date.getUTCMilliseconds()) Y-m-dTH:M:SZ
            var dateWithTimeZone = this.datePipe.transform(utcDate, 'yyyy-MM-ddTHH:mm:ssZ', z);//  '+0530'
            console.log(date + " ==== " + timeZoneOffset + " ==== " + zone + " ==== " + z + " ==== " + dateWithTimeZone + " ====  " + utcDate + " ====  " + dateWithTimeZone.toString());*/
         this.dataShare.setSession();
           //this.cookieService.set('DashboardSessionExpiration', dateDashboardSessionExpiration.toString());
            this.cookies = "";
            for (var key in grafcookies) {
              this.cookieService.set(key, grafcookies[key], date);
            }
            var uniqueString = "grfanaLoginIframe";
            var iframe = document.createElement("iframe");
            iframe.id = uniqueString;
            document.body.appendChild(iframe);
            iframe.style.display = "none";
            iframe.contentWindow.name = uniqueString;
            // construct a form with hidden inputs, targeting the iframe
            var form = document.createElement("form");
            form.target = uniqueString;
            form.action = InsightsInitService.grafanaHost + "/login";

            form.method = "POST";
            // repeat for each parameter
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "user";
            input.value = this.username;
            form.appendChild(input);

            var input1 = document.createElement("input");
            input1.type = "hidden";
            input1.name = "password";
            input1.value = this.password;
            form.appendChild(input1);

            var input2 = document.createElement("input");
            input2.type = "hidden";
            input2.name = "email";
            input2.value = '';
            form.appendChild(input2);

            document.body.appendChild(form);
            form.submit();
            setTimeout(() => {
              //self.showThrobber = false;
              self.router.navigate(['/InSights/Home']);
            }, 2000);
          } else if (data.error.message) {
            self.showThrobber = false;
            self.isLoginError = true;
            self.logMsg = data.error.message;
            self.isDisabled = false;
          }
        });
    }
  }

  deleteAllPreviousCookies(): void {
    let allCookies = this.cookieService.getAll();

    for (let key of Object.keys(allCookies)) {
      this.cookieService.delete(key);
    }
  }

}
