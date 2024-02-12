import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IDepartmentNode } from '../company-tree.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-department-node',
    templateUrl: './department-node.component.html',
    styleUrls: ['./department-node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatButtonModule, MatIconModule]
})
export class DepartmentNodeComponent {

    @Input() node!: IDepartmentNode;
    @Input() expanded = false;
    @Output('edit') editEvent = new EventEmitter<IDepartmentNode>();
    @Output() toggle = new EventEmitter<void>();

    nodeTitle() {
        let title = this.node.title;
        if (this.node.childCount) {
            title = title + ` (${this.node.childCount})`;
        }
        return title;
    }

    edit() {
        this.editEvent.emit(this.node);
    }

}
