import { NgIf } from '@angular/common';
import { IRespondent, SignUpStatus } from '@models/respondent.model';
import { IDepartment } from '@models/department.model';
import { ChangeDetectionStrategy, Component, Input, Output, OnChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { concatRespondentName } from 'src/app/store/data/data.util';
import { TWithId } from '@models/common.model';
import { EventEmitter } from '@angular/core';
import { ENodeTypes, IDepartmentContainerNode, IRespondentContainerNode, TContainerNode } from './company-tree-container.component';
import { RespondentNodeComponent } from './respondent-node/respondent-node.component';
import { DepartmentNodeComponent } from './department-node/department-node.component';

interface INode {
    childCount: number,
    expandable: boolean;
    title: string;
}

export interface IDepartmentNode extends INode, IDepartmentContainerNode { }

export interface IRespondentNode extends INode, IRespondentContainerNode {
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
    styleUrls: ['./company-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatTreeModule, RespondentNodeComponent, DepartmentNodeComponent]
})
export class CompanyTreeComponent implements OnChanges {

    @Input() respondents: ReadonlyArray<TWithId<IRespondent>> = [];
    @Input() departments: ReadonlyArray<TWithId<IDepartment>> = [];

    @Output('edit') editEvent = new EventEmitter<TContainerNode>();
    @Output('remove') removeEvent = new EventEmitter<IRespondentContainerNode>();
    @Output('invite') inviteEvent = new EventEmitter<IRespondentContainerNode>();

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
        node => this.respondents
            .filter(respondent => respondent.departmentId === node._id)
            .map(respondent => ({
                _id: respondent._id,
                type: ENodeTypes.Respondent,
                title: concatRespondentName(respondent),
                expandable: false,
                email: respondent.email,
                signUpStatus: respondent.signUpStatus,
            }))
            .sort((a, b) => a.title.localeCompare(b.title)) as Array<ITreeNode>
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    ngOnChanges() {
        const data = this.departments.map(
            department => {
                const childCount = this.respondents.reduce((prev, el) => prev + (el.departmentId === department._id ? 1 : 0), 0);
                return {
                    _id: department._id,
                    type: ENodeTypes.Department,
                    title: department.title,
                    childCount,
                    expandable: childCount > 0,
                }
            }
        ) as ITreeNode[];
        this.updateTreeView(data);
    }

    updateTreeView(data: ITreeNode[]) {
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
    }

    trackByFn = (index: number, item: IFlatNode) => {
        return item;
    }

    edit(node: ITreeNode) {
        this.editEvent.emit(node);
    }

    remove(node: IRespondentNode) {
        this.removeEvent.emit(node);
    }

    invite(node: IRespondentNode) {
        this.inviteEvent.emit(node);
    }

    isRespondent(index: number, node: IFlatNode) {
        return node.type === ENodeTypes.Respondent;
    }

    isDepartment(index: number, node: IFlatNode) {
        return node.type === ENodeTypes.Department;
    }

    toggle(node: IFlatNode) {
        this.treeControl.toggle(node);
    }
    ENodeTypes = ENodeTypes;

}
