import { Observable } from 'rxjs/Observable';

import { Component, Inject, OnInit, Optional, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodesApiService, TranslationService } from '@alfresco/adf-core';

import { forbidEndingDot, forbidOnlySpaces, forbidSpecialCharacters } from './folder-name.validators';

@Component({
    selector: 'adf-edit-uploaded-dialog',
    styleUrls: ['./edit-uploaded.dialog.scss'],
    templateUrl: './edit-uploaded.dialog.html'
})
export class EditUploadedFileComponent implements OnInit {

    form: FormGroup;

    node: MinimalNodeEntryEntity = null;

    /** Emitted when the edit properties give error
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    updated: EventEmitter<any> = new EventEmitter<MinimalNodeEntryEntity>();

    updateTitle = 'CORE.ASPECTS_DIALOG.TITLE';

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialogRef<EditUploadedFileComponent>,
        private nodesApi: NodesApiService,
        private translation: TranslationService,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        if (data) {
            this.updateTitle = data.updateTitle || this.updateTitle;
        }
    }

    get editing(): boolean {
        return !!this.data.folder;
    }

    ngOnInit() {
        const { file } = this.data;
        let name = '';
        let description = '';

        if (file) {

            name = file.name || '';

            const validators = {
                name: [
                    Validators.required,
                    forbidSpecialCharacters,
                    forbidEndingDot,
                    forbidOnlySpaces
                ]
            };

            this.form = this.formBuilder.group({
                name: [name, validators.name],
                description: [description]
            });
        }
    }

    get name(): string {
        let { name } = this.form.value;

        return (name || '').trim();
    }

    get description(): string {
        let { description } = this.form.value;

        return (description || '').trim();
    }

    private get properties(): any {
        const { name: title, description } = this;

        return {
            'cm:title': title,
            'cm:description': description
        };
    }



    private edit(): Observable<MinimalNodeEntryEntity> {
        const { name, properties, nodesApi, data: { folder: { id: nodeId } } } = this;
        return nodesApi.updateNode(nodeId, { name, properties });
    }

    submit() {
        const { form, dialog } = this;

        if (!form.valid) { return; }

        this.edit().subscribe(
            (folder: MinimalNodeEntryEntity) => {
                this.updated.emit(folder);
                dialog.close(folder);
            },
            (error) => this.handleError(error)
        );
    }

    handleError(error: any): any {
        let errorMessage = 'CORE.MESSAGES.ERRORS.GENERIC';

        try {
            const { error: { statusCode } } = JSON.parse(error.message);

            if (statusCode === 409) {
                errorMessage = 'CORE.MESSAGES.ERRORS.EXISTENT_FOLDER';
            }
        } catch (err) { /* Do nothing, keep the original message */ }

        this.error.emit(this.translation.instant(errorMessage));

        return error;
    }
}
