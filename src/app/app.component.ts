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
  private overlayLoadingTemplate;
  private overlayNoRowsTemplate;
  constructor(private test: TestService) {
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    this.overlayNoRowsTemplate =
      "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">This is a custom 'no rows' overlay</span>";
    this.maxBlocksInCache = 2;
    this.rowModelType = "infinite";
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
        headerName: "Date",
        field: "date",
        sortable: true,
        filter: "agDateColumnFilter",
        unSortIcon: true,
        filterParams: {
          browserDatePicker: true
        },
        valueFormatter: params => {
          return new Date(params.value).toUTCString();
        }
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
        this.gridApi.showLoadingOverlay();
        this.test.getUsers(params).subscribe(data => {
          setTimeout(() => {
            if (data && data["totalRecords"] > 0) {
              params.successCallback(data["users"], data["totalRecords"]);
              this.gridApi.hideOverlay();
            } else {
              // inform the grid the request failed
              this.gridApi.showNoRowsOverlay();
              params.failCallback();
            }
          }, 5000);
        });
      }
    };
    this.gridApi.setDatasource(datasource);
  }

  onPaginationChanged() {}

  ngOnInit() {}
}
