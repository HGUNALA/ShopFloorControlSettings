import { Component, OnInit } from '@angular/core';
import {
  IMIRequest,
  IMIResponse,
  ITranslationRequest,
  MIRecord,
} from '@infor-up/m3-odin';
import { FormService, MIService, UserService } from '@infor-up/m3-odin-angular';
import { SohoMessageService } from 'ids-enterprise-ng';
import { Observable, observable } from 'rxjs';
import { IDVList, Itranslations } from '../interface-list';
import { Translations } from '../translations';
@Component({
  selector: 'app-shop-floor-setting',
  templateUrl: './shop-floor-setting.component.html',
  styleUrls: ['./shop-floor-setting.component.css'],
})
export class ShopFloorSettingComponent {
  columns: SohoDataGridColumn[] = [];
  DgOptions: SohoDataGridOptions;
  userData: any;
  selTR: number = 0;
  selPC: number = 0;
  selIPC: number = 0;
  selTEA: number = 0;
  selPE: number = 0;
  selPFQ: number = 0;
  selWSP: number = 0;
  selURA: number = 0;
  selCOR: number = 0;
  selGrt: number = 0;
  selFFD: number = 0;
  selFTD: number = 0;
  selLTG: string = '';
  selAMP: number = 0;
  selLIP: number = 0;
  selLRP: number = 0;
  selEDE: number = 0;
  selPLB: string = '';
  settings1: string[] = [];
  settings: string[] = [
    'TIME_REPORTING',
    'PLAUSIBILITY_CHECK',
    'IN_PROCESS_CONTROL',
    'TANK_EMPTY_ALLOWED',
    'PRINT_ENABLED',
    'PRINT_LABEL_BMIN',
    'PRE_FILL_QUANTITY',
    'WARN_SETTING_PALLET_ZERO',
    'USE_RETURNLOC_AT_RECEIVE',
    'CAN_OVERRIDE_RETURNLOC_AT_RCV',
    'FILTER_FROM_DATE',
    'FILTER_TO_DATE',
    'LIQUID_TANK_GROUP',
    'LOCK_ISSUE_PERCENTAGE',
    'LOCK_RECEIPT_PERCENTAGE',
    'EXPIRATION_DATE_ENABLED',
  ];
  btnSetting: string[] = ['N196', 'A121', 'N096'];
  isSaveDisable: boolean = true;
  isLoadingText: string;
  isLoading: boolean;
  diviFinal: Object[] = [];
  selDiviDesc: string = '';
  divisionData: IDVList;
  lstDivi: any;
  filterLstDivi: IDVList;
  selDivi: any;
  settingIndex: number = 0;
  chgFlag: boolean;
  addFlag: boolean;
  isApply: boolean;
  isDividisable: boolean;
  languageSettings: Itranslations = this._languageTrans.usTrans;
  toolbar: SohoToolbarOptions;
  constructor(
    private _userService: UserService,
    private _miService: MIService,
    private _languageTrans: Translations,
    private _msgService: SohoMessageService
  ) {
    this.isLoading = true;

    this.isLoadingText = this.languageSettings['fetchingTheUserDetails'];
    this._userService.getUserContext().subscribe((response) => {
      this.userData = response;

      // this.whInitColumns();
      this.DgOptions = { ...this.DgOptions };

      this.isLoading = true;
    });
  }
  //   ngOnInit(): void {
  //     this.whInitColumns();
  //   }
  ngDoCheck(): void {
    if (this.userData.language === 'DE') {
      this.languageSettings = this._languageTrans.deTrans;
    } else if (this.userData.language === 'NL') {
      this.languageSettings = this._languageTrans.nlTrans;
    } else {
      this.languageSettings = this._languageTrans.usTrans;
    }
    this.whInitColumns();
    this.diviToolbar();
  }

  whInitColumns() {
    this.columns = [
      {
        width: '',
        id: 'col-DIVI',
        field: 'DIVI',
        name: this.languageSettings.division,
        resizable: true,
      },
      {
        width: '',
        id: 'col-WHLO-TX15',
        field: 'TX15',
        name: this.languageSettings.name,
        resizable: true,
      },
      {
        width: '',
        id: 'col-location',
        field: 'FACI',
        name: this.languageSettings.facility,
        resizable: true,
      },
      {
        width: '',
        id: 'col-WHLO',
        field: 'WHLO',
        name: this.languageSettings.warehouse,
        resizable: true,
      },
    ];
  }

  diviToolbar() {
    this.toolbar = {
      results: true,
      title: this.languageSettings['divisionList'],
      keywordFilter: true,
      actions: true,
      rowHeight: true,
      collapsibleFilter: false,
      fullWidth: true,
    };
  }

  protected onConfirm(message: string, title?: any) {
    const buttons = [
      {
        text: 'OK',
        click: (_e, modal) => {
          modal.close();
        },
      },
    ];
    this._msgService
      .confirm()
      .title(title)
      .message(message)
      .buttons(buttons)
      .open();
  }
  getFieldValue(setting: string) {
    let record: MIRecord = new MIRecord();

    this.isLoadingText =
      this.languageSettings['fetchingThe'] +
      ' "' +
      setting +
      '" ' +
      this.languageSettings['valuesFromTheDataBase'];
    record['FILE'] = 'ASF001';
    record['PK01'] = this.userData.Company;
    record['PK02'] = this.selDivi;
    record['PK08'] = setting;
    let output: string[] = ['N196', 'A121', 'N096'];
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'GetFieldValue',
      record: record,
      outputFields: output,
      maxReturnedRecords: 0,
    };
    this._miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.addFlag = false;
        this.chgFlag = false;
        this.allocateSetting(request.record['PK08'], response);
        if (this.settingIndex < this.settings.length - 1) {
          this.getFieldValue(this.settings[++this.settingIndex]);
        } else {
          this.isDividisable = false;
          this.addFlag = true;
          this.isApply = true;
          this.isLoading = false;
          this.settingIndex = 0;
        }
      },
      (error: IMIResponse) => {
        this.isDividisable = false;
        this.isApply = true;
        this.isLoading = false;
      }
    );
  }
  getChgFieldValue(setting: string) {
    this.chgFlag = true;
    this.isLoading = true;
    this.allocateSetting(setting);
  }
  getAddFieldValue(setting: string) {
    this.chgFlag = false;
    this.allocateSetting(setting);
    this.isLoading = true;
  }
  allocateSetting(_request: string, _response?: IMIResponse) {
    switch (_request) {
      case 'TIME_REPORTING': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selTR, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selTR = +_response.item['N196'];
        }
        break;
      }
      case 'PLAUSIBILITY_CHECK': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selPC, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selPC = +_response.item['N196'];
        }
        break;
      }
      case 'IN_PROCESS_CONTROL': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selIPC, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selIPC = +_response.item['N196'];
        }
        break;
      }
      case 'TANK_EMPTY_ALLOWED': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selTEA, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selTEA = +_response.item['N196'];
        }
        break;
      }
      case 'PRINT_ENABLED': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selPE, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selPE = +_response.item['N196'];
        }
        break;
      }
      case 'PRINT_LABEL_BMIN': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selPLB, 'A121');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selPLB = _response.item['A121'];
        }
        break;
      }
      case 'PRE_FILL_QUANTITY': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selPFQ, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selPFQ = +_response.item['N196'];
        }
        break;
      }
      case 'WARN_SETTING_PALLET_ZERO': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selWSP, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selWSP = +_response.item['N196'];
        }
        break;
      }
      case 'USE_RETURNLOC_AT_RECEIVE': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selURA, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selURA = +_response.item['N196'];
        }
        break;
      }
      case 'CAN_OVERRIDE_RETURNLOC_AT_RCV': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selCOR, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selCOR = +_response.item['N196'];
        }
        break;
      }
      case 'FILTER_FROM_DATE': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selFFD, 'N096');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selFFD = +_response.item['N096'];
        }
        break;
      }
      case 'FILTER_TO_DATE': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selFTD, 'N096');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selFTD = +_response.item['N096'];
        }
        break;
      }
      case 'LIQUID_TANK_GROUP': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selLTG, 'A121');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selLTG = _response.item['A121'];
        }
        break;
      }
      case 'LOCK_ISSUE_PERCENTAGE': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selLIP, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selLIP = +_response.item['N196'];
        }
        break;
      }
      case 'LOCK_RECEIPT_PERCENTAGE': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selLRP, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selLRP = +_response.item['N196'];
        }
        break;
      }
      case 'EXPIRATION_DATE_ENABLED': {
        if (this.chgFlag) {
          this.getChgFieldValueRequest(_request, this.selEDE, 'N196');
        } else if (this.addFlag) {
          this.getAddFieldValueRequest(_request, this.selTR, 'N196');
        } else {
          this.selEDE = +_response.item['N196'];
        }
        break;
      }
    }
  }
  onTime(event?: any) {
    this.settings1[this.settingIndex++] = 'TIME_REPORTING';
    this.isSaveDisable = false;
  }
  onPLCheck() {
    this.settings1[this.settingIndex++] = 'PLAUSIBILITY_CHECK';
    this.isSaveDisable = false;
  }
  onIPC() {
    this.settings1[this.settingIndex++] = 'IN_PROCESS_CONTROL';
    this.isSaveDisable = false;
  }
  onTEA() {
    this.settings1[this.settingIndex++] = 'TANK_EMPTY_ALLOWED';
    this.isSaveDisable = false;
  }
  onPE() {
    this.settings1[this.settingIndex++] = 'PLAUSIBILITY_CHECK';
    this.isSaveDisable = false;
  }
  onPLB() {
    this.settings1[this.settingIndex++] = 'PRINT_LABEL_BMIN';
    this.isSaveDisable = false;
  }
  onPFQ() {
    this.settings1[this.settingIndex++] = 'PRE_FILL_QUANTITY';
    this.isSaveDisable = false;
  }
  onWSP() {
    this.settings1[this.settingIndex++] = 'WARN_SETTING_PALLET_ZERO';
    this.isSaveDisable = false;
  }
  onURA() {
    this.settings1[this.settingIndex++] = 'USE_RETURNLOC_AT_RECEIVE';
    this.isSaveDisable = false;
  }
  onCOR() {
    this.settings1[this.settingIndex++] = 'CAN_OVERRIDE_RETURNLOC_AT_RCV';
    this.isSaveDisable = false;
  }
  onGRT() {
    this.settings1[this.settingIndex++] = 'USE_GRTI';
    this.isSaveDisable = false;
  }
  onFFD() {
    this.settings1[this.settingIndex++] = 'FILTER_FROM_DATE';
    this.isSaveDisable = false;
  }
  onFTD() {
    this.settings1[this.settingIndex++] = 'FILTER_TO_DATE';
    this.isSaveDisable = false;
  }
  onLTG() {
    this.settings1[this.settingIndex++] = 'LIQUID_TANK_GROUP';
    this.isSaveDisable = false;
  }
  onAMP() {
    this.settings1[this.settingIndex++] = 'ADDITIONAL_MO_PICTURE_FOLDERS';
    this.isSaveDisable = false;
  }
  onLIP() {
    this.settings1[this.settingIndex++] = 'LOCK_ISSUE_PERCENTAGE';
    this.isSaveDisable = false;
  }
  onLRP() {
    this.settings1[this.settingIndex++] = 'LOCK_RECEIPT_PERCENTAGE';
    this.isSaveDisable = false;
  }
  onEDE() {
    this.settings1[this.settingIndex++] = 'EXPIRATION_DATE_ENABLED';
    this.isSaveDisable = false;
  }
  getChgFieldValueRequest(setting: string, setValue: any, btnSetting1: string) {
    let record: MIRecord = new MIRecord();
    this.isLoadingText =
      this.languageSettings['changingThe'] +
      ' "' +
      setting +
      '" ' +
      this.languageSettings['valuesInTheDataBase'];
    record['FILE'] = 'ASF001';
    record['PK01'] = this.userData.company;
    record['PK02'] = this.selDivi;
    record['PK08'] = setting;
    if (setValue.toString() === 'false') {
      record[btnSetting1] = '0';
    } else if (setValue.toString() === 'true') {
      record[btnSetting1] = '1';
    } else {
      record[btnSetting1] = setValue;
    }
    let output: string[] = ['N196', 'A121', 'N096'];
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'ChgFieldValue',
      record: record,
      outputFields: output,
      maxReturnedRecords: 0,
    };
    this._miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (this.settingIndex < this.settings1.length - 1) {
          this.addFlag = false;

          this.getChgFieldValue(this.settings1[++this.settingIndex]);
        } else {
          this.onConfirm(
            this.languageSettings['saveSuccessful'],
            this.languageSettings['shopFloorControlSettings']
          );
          this.isLoading = false;
          this.isDividisable = false;
          this.isApply = true;
        }
      },
      (error: IMIResponse) => {
        this.addFlag = true;
        if (this.settingIndex < this.settings1.length) {
          this.getAddFieldValue(this.settings1[this.settingIndex]);
        }
      }
    );
  }
  getAddFieldValueRequest(setting: string, setValue: any, btnSetting1: string) {
    let record: MIRecord = new MIRecord();
    this.isLoadingText =
      this.languageSettings['addingThe'] +
      ' "' +
      setting +
      '" ' +
      this.languageSettings['valuesInTheDataBase'];
    record['FILE'] = 'ASF001';
    record['PK01'] = this.userData.company;
    record['PK02'] = this.selDivi;
    record['PK08'] = setting;
    if (setValue.toString() === 'false') {
      record[btnSetting1] = '0';
    } else if (setValue.toString() === 'true') {
      record[btnSetting1] = '1';
    } else {
      record[btnSetting1] = setValue;
    }
    let output: string[] = ['N196', 'A121', 'N096'];
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'AddFieldValue',
      record: record,
      outputFields: output,
      maxReturnedRecords: 0,
    };
    this._miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isLoading = false;
        if (this.settingIndex < this.settings.length - 1) {
          this.getChgFieldValue(this.settings[++this.settingIndex]);
        } else {
          this.onConfirm(
            this.languageSettings['saveSuccessful'],
            this.languageSettings['shopFloorControlSettings']
          );
          this.isLoading = false;
        }
      },
      (error: IMIResponse) => {
        this.isLoading = false;
      }
    );
  }
  getDiviList() {
    let record: MIRecord = new MIRecord();
    this.isLoadingText =
      this.languageSettings['fetchingTheDivisionListFrom'] +
      ' ' +
      this.userData.company;
    record['CONO'] = this.userData.company;
    let output: string[] = ['TX15', 'DIVI', 'FACI', 'WHLO'];
    this._miService
      .execute({
        includeMetadata: true,
        program: 'MNS100MI',
        transaction: 'LstDivisions',
        record: record,
        outputFields: output,
        maxReturnedRecords: 0,
      })
      .subscribe((response: IMIResponse) => {
        this.lstDivi = response.items;
        this.filterdivisionData();
      });
  }

  filterdivisionData() {
    const result = this.lstDivi.filter((obj: any) => {
      return obj.DIVI !== '';
    });

    this.lstDivi = result;

    this.diviFinal = this.lstDivi;
    this.isLoading = false;
  }
  onDivision(event: any) {
    this.isDividisable = true;
    this.isApply = false;
    this.isSaveDisable = true;

    this.selDiviDesc =
      event.lookup.selectedRows[0].data.DIVI +
      ' - ' +
      event.lookup.selectedRows[0].data.TX15;
    this.selDivi = event.lookup.selectedRows[0].data.DIVI;
    this.settingIndex = 0;
    this.selGrt = 0;
    this.isLoading = true;
    this.getFieldValue(this.settings[this.settingIndex]);
  }
  onSave(event: any) {
    this.isDividisable = true;
    this.isSaveDisable = true;
    this.isApply = false;
    this.settingIndex = 0;
    this.getChgFieldValue(this.settings1[this.settingIndex]);
  }
}
