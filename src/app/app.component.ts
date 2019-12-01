import { Component, OnInit, ViewChild } from "@angular/core";
import { TestService } from "./core/services/test.service";
import {
  GridOptions,
  IDatasource,
  IGetRowsParams,
  GridApi,
  ColDef,
  CellClickedEvent,
  AllCommunityModules,
  Module
} from "@ag-grid-community/all-modules";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public modules: Module[] = AllCommunityModules;
  gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: ColDef[];
  userSubscriber: Subscription;
  rowData: any;
  private rowModelType;
  private paginationPageSize;
  private cacheOverflowSize;
  private maxConcurrentDatasourceRequests;
  private infiniteInitialRowCount;
  private maxBlocksInCache;
  private components;
  constructor(private test: TestService) {
    this.maxBlocksInCache = 2;
    this.rowModelType = "infinite";
    this.components = {
      loadingCellRenderer: function(params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif">';
        }
      }
    };
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
        filter: "agNumberColumnFilter",
        unSortIcon: true
      },
      {
        headerName: "First Name",
        field: "first_name",
        sortable: true,
        filter: "agTextColumnFilter",
        unSortIcon: true
      },
      {
        headerName: "Last Name",
        field: "last_name",
        sortable: true,
        filter: "agTextColumnFilter",
        unSortIcon: true
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: "agTextColumnFilter",
        unSortIcon: true
      },
      {
        headerName: "Gender",
        field: "gender",
        sortable: true,
        filter: "agTextColumnFilter",
        unSortIcon: true
      },
      {
        headerName: "Company",
        field: "company",
        sortable: true,
        filter: "agTextColumnFilter",
        unSortIcon: true
      }
    ];

    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.infiniteInitialRowCount = 1;
    this.paginationPageSize = 20;
  }

  onPageSizeChanged(newPageSize: Number) {
    this.gridApi.paginationSetPageSize(Number(newPageSize));
  }

  onGridReady(params) {
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
