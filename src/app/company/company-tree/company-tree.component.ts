import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';


type TNodeType = 'department' | 'respondent';

interface ICompanyStructureNode {
    type: TNodeType,
    title: string;
    children?: ICompanyStructureNode[];
}

const TREE_DATA: ICompanyStructureNode[] = [
    {
        type: 'department',
        title: 'Технический отдел',
        children: [
            { type: 'respondent', title: 'Ковтун Артем' },
            { type: 'respondent', title: 'Фролов Максим' }
        ],
    },
    {
        type: 'department',
        title: 'Отдел продаж',
        children: [
            { type: 'respondent', title: 'Щербинский Алексей' },
            { type: 'respondent', title: 'Яковлев Евгений' }
        ],
    },
];

interface IFlatNode {
    expandable: boolean;
    title: string;
    type: TNodeType;
    level: number;
}

@Component({
    selector: 'app-company-tree',
    templateUrl: './company-tree.component.html',
    styleUrls: ['./company-tree.component.scss']
})
export class CompanyTreeComponent implements OnInit{

    private _transformer = (node: ICompanyStructureNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            title: node.title,
            type: node.type,
            level: level,
        };
    };

    treeControl = new FlatTreeControl<IFlatNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor() {
        this.dataSource.data = TREE_DATA;
    }

    ngOnInit(): void {
        this.treeControl.expandAll();
    }

    hasChild = (_: number, node: IFlatNode) => node.expandable;

}
