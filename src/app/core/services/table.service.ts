import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { IGetRowsParams } from "@ag-grid-community/all-modules";
const BACKEND_URL = environment.apiUrl + "/table";
@Injectable({
  providedIn: "root"
})
export class TableService {
  private tables: any[] = [];
  private tablesUpdated = new Subject<{ items: any[]; totalRecords: number }>();
  constructor(private http: HttpClient) {}
  getTableUpdateListener() {
    return this.tablesUpdated.asObservable();
  }
  getUsers(params: IGetRowsParams) {
    var sortColId = "";
    var sort = ""; //asc or desc
    var filterModel;
    const sortModel = params.sortModel;
    let sortParam;
    if (sortModel.length) {
      // implement fake sorting
      sortModel.forEach(element => {
        sortColId = element.colId;
        sort = element.sort;
      });

      if (sort == "asc") {
        sortParam = sortColId;
      } else {
        sortParam = "-" + sortColId;
      }
    }
    const url =BACKEND_URL + "?start=" + params.startRow + "&end=" + params.endRow;
    this.http.get<{ items: any; totalRecords: number }>(url).subscribe(data => {
      this.tables = data.items;
      this.tablesUpdated.next({
        items: [...this.tables],
        totalRecords: data.totalRecords
      });
    });
  }
}
