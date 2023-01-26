import { Injectable } from '@angular/core';
import { UserService } from '@infor-up/m3-odin-angular';
import { IUserContext, Log } from '@infor-up/m3-odin';
import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})

export class DemoUserContextService {

   userContext: IUserContext;

   constructor(private userService: UserService) {
      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.userContext = userContext;
      });
   }

   getUserContext(): Observable<IUserContext> {
      return this.userService.getUserContext();
   }

   getDateFormat(): string {
      let dateFormat: string;
      const dtfm = this.userContext.DTFM;
      switch (dtfm) {
         case "YMD":
            dateFormat = "yy/MM/dd";
            break;
         case "MDY":
            dateFormat = "MM/dd/yy";
            break;
         case "DMY":
            dateFormat = "dd/MM/yy";
            break;
         default:
            dateFormat = "yy/MM/dd";
      }
      return dateFormat;
   }

   getDate(date: string): Date {
      try {
         let year: number;
         let month: number;
         let day: number;
         const dtfm = this.userContext.DTFM;
         switch (dtfm) {
            case "YMD":
               year = parseInt("20" + date.substr(0, 2));
               month = parseInt(date.substr(3, 2)) - 1;
               day = parseInt(date.substr(6, 2));
               break;
            case "MDY":
               year = parseInt("20" + date.substr(6, 2));
               month = parseInt(date.substr(0, 2)) - 1;
               day = parseInt(date.substr(3, 2));
               break;
            case "DMY":
               year = parseInt("20" + date.substr(6, 2));
               month = parseInt(date.substr(3, 2)) - 1;
               day = parseInt(date.substr(0, 2));
               break;
         }
         return new Date(year, month, day);
      } catch (err) {
         Log.debug(err);
         return null;
      }
   }

   getDateFormatted(date: string): string {
      try {
         let year: number;
         let month: number;
         let day: number;
         const dtfm = this.userContext.DTFM;
         switch (dtfm) {
            case "YMD":
               year = parseInt("20" + date.substr(0, 2));
               month = parseInt(date.substr(3, 2)) - 1;
               day = parseInt(date.substr(6, 2));
               break;
            case "MDY":
               year = parseInt("20" + date.substr(6, 2));
               month = parseInt(date.substr(0, 2)) - 1;
               day = parseInt(date.substr(3, 2));
               break;
            case "DMY":
               year = parseInt("20" + date.substr(6, 2));
               month = parseInt(date.substr(3, 2)) - 1;
               day = parseInt(date.substr(0, 2));
               break;
         }
         return MIUtil.getDateFormatted(new Date(year, month, day));
      } catch (err) {
         Log.debug(err);
         return null;
      }
   }

}
