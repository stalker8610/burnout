import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Store } from '@ngrx/store';
import { getDepartments, getTeam } from '../../store/data/data.selectors';
import { MatDialog } from '@angular/material/dialog';
import { TObjectId } from "@models/common.model";
import { IRespondent } from "@models/respondent.model";
import { IDepartment } from "@models/department.model";
import { AuthActions } from "src/app/store/auth/auth.actions";
import { DataActions } from "src/app/store/data/data.actions";
import { RespondentContainerComponent } from "../respondent/respondent-container.component";
import { DepartmentContainerComponent } from "../department/department-container.component";
import { CompanyTreeComponent } from "./company-tree.component";
import { AsyncPipe } from "@angular/common";

export enum ENodeTypes {
    Department = 'department',
    Respondent = 'respondent'
}

export interface IDepartmentContainerNode {
    _id: TObjectId<IDepartment>,
    type: ENodeTypes.Department,
}

export interface IRespondentContainerNode {
    _id: TObjectId<IRespondent>,
    type: ENodeTypes.Respondent,
}

export type TContainerNode = IDepartmentContainerNode | IRespondentContainerNode;

@Component({
    selector: 'app-company-tree-container',
    standalone: true,
    template: ` <app-company-tree 
                    [respondents]="(respondents$ | async) || []" 
                    [departments]="(departments$ | async) || []"
                    (edit)="edit($event)"
                    (remove)="remove($event)"
                    (invite)="invite($event)">
                </app-company-tree>`,
    imports: [CompanyTreeComponent, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyTreeContainer {

    respondents$ = this.store.select(getTeam(true));
    departments$ = this.store.select(getDepartments);

    constructor(private store: Store, private editDialog: MatDialog) { }

    openRespondentEditDialog(respondentId: TObjectId<IRespondent>): void {
        this.editDialog.open(RespondentContainerComponent, {
            width: '600px',
            disableClose: true,
            data: { respondentId }
        });
    }

    openDepartmentEditDialog(departmentId: TObjectId<IDepartment>): void {
        this.editDialog.open(DepartmentContainerComponent, {
            width: '600px',
            disableClose: true,
            data: { departmentId }
        });
    }

    edit(node: TContainerNode) {
        if (node.type === ENodeTypes.Respondent) {
            this.openRespondentEditDialog(node._id);
        } else if (node.type === ENodeTypes.Department) {
            this.openDepartmentEditDialog(node._id);
        }
    }

    invite(node: IRespondentContainerNode) {
        this.store.dispatch(AuthActions.invite({ respondentId: node._id }));
    }

    remove(node: IRespondentContainerNode) {
        this.store.dispatch(DataActions.removeRespondent({ _id: node._id }))
    }


}