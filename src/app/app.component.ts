import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { TableService } from "./core/services/table.service";
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
export class AppComponent implements OnInit, OnDestroy {
  private pageSizes = [10, 20, 50, 100];
  private isSyncAnimated: boolean = true;
  public modules: Module[] = AllCommunityModules;
  gridOptions: GridOptions;
  private gridApi: GridApi;
  columnDefs: ColDef[];
  userSubscriber: Subscription;
  rowData: any;
  private tableSub: Subscription;
  private rowModelType;
  private paginationPageSize;
  private defaultColDef;
  private cacheOverflowSize;
  private maxConcurrentDatasourceRequests;
  private infiniteInitialRowCount;
  private maxBlocksInCache;
  private overlayLoadingTemplate;
  private overlayNoRowsTemplate;
  constructor(private test: TableService) {
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    this.overlayNoRowsTemplate =
      "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">This is a custom 'no rows' overlay</span>";
    this.maxBlocksInCache = 2;
    this.rowModelType = "infinite";
    this.columnDefs = [
      {
        headerName: "",
        field: "_id",
        width: 45,
        suppressAutoSize: true,

        cellRenderer: () => '<i class="material-icons">edit</i>',
        onCellClicked: (params: CellClickedEvent) => console.log(params.data.id)
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
    this.defaultColDef = {
      suppressMenu: true,
      resizable: true,
      autoHeight: true,
      headerCheckboxSelectionFilteredOnly: true
    };
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 2;
    this.paginationPageSize = 20;
  }

  onPageSizeChanged(newPageSize: Number) {
    this.gridApi.paginationSetPageSize(Number(newPageSize));
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
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
        this.test.getUsers(params);
        this.tableSub = this.test.getTableUpdateListener().subscribe(data => {
          if (data && data["totalRecords"] > 0) {
            params.successCallback(data["items"], data["totalRecords"]);
            this.gridApi.hideOverlay();
          } else {
            // inform the grid the request failed
            this.gridApi.showNoRowsOverlay();
            params.failCallback();
          }
        });
      }
    };
    this.gridApi.setDatasource(datasource);
  }

  onPaginationChanged() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.tableSub.unsubscribe();
  }
}
