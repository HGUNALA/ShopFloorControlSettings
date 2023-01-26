import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoolupDataService {
  columns: SohoDataGridColumn[] = [];
  DgOptions: SohoDataGridOptions;

  constructor() {}

  InitDataGridOptions(
    title: string,
    columns: SohoDataGridColumn[]
  ): SohoDataGridOptions {
    const options: SohoDataGridOptions = {
      alternateRowShading: false,
      cellNavigation: false,
      clickToSelect: false,
      disableRowDeactivation: false,
      editable: true,
      paging: true,
      pagesize: 5,
      isList: false,
      indeterminate: false,
      rowNavigation: false,
      rowHeight: 'normal' as SohoDataGridRowHeight,
      showDirty: true,
      toolbar: {
        results: true,
        title: title,
        hasMoreButton: true,
        noSearchfieldReinvoke: true,
        keywordFilter: true,
        collapsibleFilter: true,
      },
      columns: columns,
      dataset: [],
      emptyMessage: {
        title: 'No data available',
        color: 'amber',
        info: 'Start typing your Manufacturing Order Number to add to the list ',
        icon: 'icon-empty-no-data',
      },
    };
    return options;
  }
  whInitColumns() {
    this.columns = [
      {
        width: '',
        id: 'col-DIVI',
        field: 'DIVI',
        name: 'Division',
        resizable: true,
      },
      {
        width: '',
        id: 'col-WHLO-TX15',
        field: 'TX15',
        name: 'Description',
        resizable: true,
      },
      {
        width: '',
        id: 'col-location',
        field: 'FACI',
        name: 'Facility',
        resizable: true,
      },
      {
        width: '',
        id: 'col-WHLO',
        field: 'WHLO',
        name: 'Warehouse',
        resizable: true,
      },
    ];
  }
  diviInit() {
    this.DgOptions = this.InitDataGridOptions('', this.columns);
  }
}
