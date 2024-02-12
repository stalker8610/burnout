import { CdkTree } from '@angular/cdk/tree';
import { IRespondentNode } from './../company-tree.component';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SignUpStatus } from '@models/respondent.model';
import { getSignUpStatusView } from 'src/app/store/data/data.util';

@Component({
    selector: 'app-respondent-node',
    templateUrl: './respondent-node.component.html',
    styleUrls: ['./respondent-node.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RespondentNodeComponent {

    @Input() node!: IRespondentNode;
    @Output('edit') editEvent = new EventEmitter<IRespondentNode>()
    @Output('remove') removeEvent = new EventEmitter<IRespondentNode>()
    @Output('invite') inviteEvent = new EventEmitter<IRespondentNode>()

    getSignUpStatusClass = (status: SignUpStatus) => {
        return {
            signedUp: status === SignUpStatus.SingedUp,
            invited: status === SignUpStatus.Invited,
            notInvitedYet: status === SignUpStatus.NotInvitedYet
        }
    }

    removable() {
        return (this.node.signUpStatus === SignUpStatus.NotInvitedYet ||
            this.node.signUpStatus === SignUpStatus.Invited);
    }

    invitable() {
        return (this.node.signUpStatus === SignUpStatus.NotInvitedYet ||
            this.node.signUpStatus === SignUpStatus.Invited);
    }

    isDisabled() {
        return this.node.signUpStatus === SignUpStatus.Disabled;
    }

    edit() {
        this.editEvent.emit(this.node);
    }

    invite() {
        this.inviteEvent.emit(this.node);
    }

    remove() {
        this.removeEvent.emit(this.node);
    }

    getSignUpStatusView = getSignUpStatusView;
    SignUpStatus = SignUpStatus;
}
