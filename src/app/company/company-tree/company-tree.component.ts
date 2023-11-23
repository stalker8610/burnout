import { IRespondent, SignUpStatus } from '@models/respondent.model';
import { IDepartment } from '@models/department.model';
import { TObjectId } from '@models/common.model';
import { map, switchMap, tap, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store } from '@ngrx/store';
import { getDepartmentsAndTeam, getTeam } from '../../store/data/data.selectors';
import { concatRespondentName, parseName } from 'src/app/store/data/data.util';
import { removeDepartment, removeRespondent, patchRespondent, patchDepartment } from 'src/app/store/data/data.actions';
import { FormControl } from '@angular/forms';
import { getSignUpStatusView } from 'src/app/store/data/data.util';
import { MatDialog } from '@angular/material/dialog';
import { RespondentComponent } from '../respondent/respondent.component';

enum ENodeTypes {
    Department = 'department',
    Respondent = 'respondent'
}

interface INode {
    childCount: number,
    expandable: boolean;
    title: string;
}

interface IDepartmentNode extends INode {
    _id: TObjectId<IDepartment>,
    type: ENodeTypes.Department
}

interface IRespondentNode extends INode {
    _id: TObjectId<IRespondent>,
    type: ENodeTypes.Respondent,
    signUpStatus: SignUpStatus,
    email: string
}

type ITreeNode = IDepartmentNode | IRespondentNode
type IFlatNode = ITreeNode & {
    level: number;
}

@Component({
    selector: 'app-company-tree',
    templateUrl: './company-tree.component.html',
    styleUrls: ['./company-tree.component.scss']
})
export class CompanyTreeComponent implements OnInit {

    ENodeTypes = ENodeTypes;

    private _transformer = (node: ITreeNode, level: number): IFlatNode => {
        return Object.assign({}, node, {
            level: level
        })
    };

    treeControl = new FlatTreeControl<IFlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener<ITreeNode, IFlatNode>(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => this.store.select(getTeam(true)).pipe(
            map(respondents =>
                (respondents?.filter(respondent => respondent.departmentId === node._id)
                    .map(respondent => ({
                        _id: respondent._id,
                        type: ENodeTypes.Respondent,
                        title: this.respondentName(respondent),
                        expandable: false,
                        email: respondent.email,
                        signUpStatus: respondent.signUpStatus,
                    })) || [])
                    .sort((a, b) => a.title.localeCompare(b.title)) as Array<ITreeNode>
            )
        )
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    editNode: IFlatNode | null = null;
    editNodeControl = new FormControl('');

    constructor(private store: Store, public respondentDialog: MatDialog) { }

    ngOnInit(): void {
        this.store.select(getDepartmentsAndTeam)
            .pipe(
                switchMap(({ departments, team }) =>
                    of((departments?.slice().sort((a, b) => a.title.localeCompare(b.title))
                        .map(
                            department => {
                                const childCount = team?.filter(element => element.departmentId === department._id).length || 0;
                                return {
                                    _id: department._id,
                                    type: ENodeTypes.Department,
                                    title: department.title,
                                    childCount,
                                    expandable: !!childCount,
                                }
                            }) || []) as Array<ITreeNode>)
                )
            ).subscribe(
                data => {
                    if (!this.dataSource.data.length) {
                        this.dataSource.data = data;
                        this.treeControl.expandAll();
                    } else {
                        // re-expand nodes after new node was added
                        const expandedNodes: IFlatNode['_id'][] = [];
                        if (this.treeControl.dataNodes) {
                            this.treeControl.dataNodes.forEach(node => {
                                if (this.treeControl.isExpandable(node) && this.treeControl.isExpanded(node)) {
                                    expandedNodes.push(node._id);
                                }
                            });
                        }

                        this.dataSource.data = data;

                        this.treeControl.dataNodes
                            .filter(node => expandedNodes.find(_id => _id === node._id))
                            .forEach(nodeToExpand => {
                                if (this.treeControl.isExpandable(nodeToExpand)) {
                                    this.treeControl.expand(nodeToExpand);
                                }
                            });
                    }

                });
    }

    hasChild = (_: number, node: IFlatNode) => node.expandable;

    getNodeClass(node: IFlatNode) {
        return {
            'node': true,
            'department': node.type === ENodeTypes.Department,
            'respondent': node.type === ENodeTypes.Respondent,
            'disabled-respondent': node.type === ENodeTypes.Respondent && node.signUpStatus === SignUpStatus.Disabled
        }
    }

    nodeTitle = (node: IFlatNode) => {
        let title = node.title;
        if (node.childCount) {
            title = title + ` (${node.childCount})`;
        }
        return title;
    }

    removable = (node: IFlatNode) => {
        return node.type === ENodeTypes.Respondent && (node.signUpStatus === SignUpStatus.NotInvitedYet ||
            node.signUpStatus === SignUpStatus.Invited);
    }

    invitable = (node: IFlatNode) => {
        return node.type === ENodeTypes.Respondent && node.signUpStatus === SignUpStatus.NotInvitedYet;
    }

    isDisabled = (node: IFlatNode) => {
        return node.type === ENodeTypes.Respondent && node.signUpStatus === SignUpStatus.Disabled;
    }

    getSignUpStatusClass = (status: SignUpStatus) => {
        return {
            signedUp: status === SignUpStatus.SingedUp,
            invited: status === SignUpStatus.Invited,
            notInvitedYet: status === SignUpStatus.NotInvitedYet
        }
    }

    trackByFn = (index: number, item: IFlatNode) => {
        return item;
    }

    private respondentName(respondent: IRespondent) {
        return concatRespondentName(respondent);
    }

    edit(node: IFlatNode) {
        /* this.editNode = node;
        this.editNodeControl.reset(node.title); */
        this.openRespondentDialog(node._id);
    }

    confirmEdit() {

        if (!this.editNodeControl.value || !this.editNodeControl.dirty) {
            this.cancelEdit();
            return;
        }

        if (this.editNode?.type === ENodeTypes.Respondent) {
            const respondent = {
                _id: this.editNode._id,
                ...parseName(this.editNodeControl.value)
            }
            this.store.dispatch(patchRespondent({ respondent }))
        } else if (this.editNode?.type === ENodeTypes.Department) {
            const department = {
                _id: this.editNode._id,
                title: this.editNodeControl.value
            }
            this.store.dispatch(patchDepartment({ department }));
        }

        this.editNode = null;
        this.editNodeControl.reset();
    }



    cancelEdit() {
        this.editNode = null;
        this.editNodeControl.reset();
    }

    remove(node: IFlatNode) {
        if (node.type === ENodeTypes.Respondent) {
            this.store.dispatch(removeRespondent({ _id: node._id }))
        } else if (node.type === ENodeTypes.Department) {
            this.store.dispatch(removeDepartment({ _id: node._id }))
        }
    }


    openRespondentDialog(respondentId: TObjectId<IRespondent>): void {
        this.respondentDialog.open(RespondentComponent, {
            width: '600px',
            disableClose: true,
            data: { respondentId }
        });
    }


    getSignUpStatusView = getSignUpStatusView;
}
