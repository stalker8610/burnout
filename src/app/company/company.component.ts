import { addRespondentRequest, loadRequested } from '../store/data/data.actions';
import { getDepartments } from './../store/data/data.selectors';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IDepartment } from '@models/department.model';
import { TWithId } from '@models/common.model';
import { Observable, of, startWith, map, switchMap, filter } from 'rxjs';

import { TNewResponentToCreate } from '../store/data/data.actions';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent {
    

}
