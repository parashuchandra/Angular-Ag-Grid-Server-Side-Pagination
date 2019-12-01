import { Component, OnInit, ViewChild } from "@angular/core";
import { TestService } from "./core/services/test.service";
import { AgGridAngular } from "ag-grid-angular";
import {
  GridOptions,
  IDatasource,
  IGetRowsParams,
  GridApi,
  ColDef,
  CellClickedEvent,
} from "ag-grid-community";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("myGrid", { static: true }) myGrid: AgGridAngular;

  gridOptions: Partial<GridOptions>;
  private gridApi: GridApi;
  columnDefs: ColDef[];
  cacheOverflowSize: number;
  maxConcurrentDatasourceRequests: number;
  infiniteInitialRowCount: number;
  userSubscriber: Subscription;
  rowData: any;

  constructor(private test: TestService) {
    this.columnDefs = [
      {
        headerName: "",
        field: "id",
        width: 50,
        cellRenderer: function() {
          return '<img src="assets/icons/edit.svg">';
        },
        onCellClicked: (params: CellClickedEvent) => console.log(params.data.id)
      },
      {
        headerName: "User Id",
        field: "id",
        sortable: true,
        filter: "agNumberColumnFilter"
      },
      {
        headerName: "First Name",
        field: "first_name",
        sortable: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: "Last Name",
        field: "last_name",
        sortable: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: "Gender",
        field: "gender",
        sortable: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: "Company",
        field: "company",
        sortable: true,
        filter: "agTextColumnFilter"
      }
    ];

    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 2;

    this.gridOptions = {
      headerHeight: 45,
      rowHeight: 30,
      cacheBlockSize: 90,
      paginationPageSize: 90,
      rowModelType: "infinite",
      floatingFilter: true,
      getRowStyle: params => {
        if (params.node.rowIndex % 2 === 0) {
          return { background: "#e0e0e0" };
        }
      }
    };
  }

  onGridReady(params) {
    console.log("On Grid Ready");

    this.gridApi = params.api;

    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        //  TODO: Call a service that fetches list of users
        console.log(
          "Fetching startRow " + params.startRow + " of " + params.endRow
        );
        console.log(params);
        this.test.getUsers(params).subscribe(data => {
          console.log(data);
          params.successCallback(data["users"], data["totalRecords"]);
        });
      }
    };

    this.gridApi.setDatasource(datasource);
  }

  onPaginationChanged() {}

  ngOnInit() {}
}
