/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService, UploadService, setupTestBed, CoreModule, FileModel } from '@alfresco/adf-core';
import { UploadBase } from './upload-base';
import { TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'adf-upload-button-test',
    template: 'test componente'
})

export class UploadTestComponent extends UploadBase {

    constructor(protected uploadService: UploadService,
                protected translationService: TranslationService) {
        super(uploadService, translationService);
    }
}

describe('UploadBase', () => {

    let component: UploadTestComponent;
    let fixture: ComponentFixture<UploadTestComponent>;
    let uploadService: UploadService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            UploadTestComponent
        ],
        providers: [
            UploadService,
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadTestComponent);
        uploadService = TestBed.get(UploadService);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('filesize', () => {

        const files: File[] = [
            <File> { name: 'bigFile.png', size: 1000 },
            <File> { name: 'smallFile.png', size: 10 }
        ];

        let addToQueueSpy;

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should filter out file, which are too big if max file size is set', () => {
            component.maxFilesSize = 100;

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(1);
            expect(filesCalledWith[0].name).toBe('smallFile.png');
        });

        it('should filter out all files if maxFilesSize is 0', () => {
            component.maxFilesSize = 0;

            component.uploadFiles(files);

            expect(addToQueueSpy.calls.mostRecent()).toBeUndefined();
        });

        it('should allow file of 0 size when the max file size is set to 0', () => {
            const zeroFiles: File[] = [
                <File> { name: 'zeroFile.png', size: 0 }
            ];
            component.maxFilesSize = 0;

            component.uploadFiles(zeroFiles);

            expect(addToQueueSpy.calls.mostRecent()).toBeDefined();
        });

        it('should filter out all files if maxFilesSize is <0', () => {
            component.maxFilesSize = -2;

            component.uploadFiles(files);

            expect(addToQueueSpy.calls.mostRecent()).toBeUndefined();
        });

        it('should output an error when you try to upload a file too big', (done) => {
            component.maxFilesSize = 100;

            component.error.subscribe(() => {
                done();
            });

            component.uploadFiles(files);
        });

        it('should not filter out files if max file size is not set', () => {
            component.maxFilesSize = null;

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(2);
        });
    });

    describe('uploadFiles', () => {

        const files: File[] = [
            <File> { name: 'phobos.jpg' },
            <File> { name: 'deimos.png' },
            <File> { name: 'ganymede.bmp' }
        ];

        let addToQueueSpy;

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should filter out file, which is not part of the acceptedFilesType', () => {
            component.acceptedFilesType = '.jpg';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(1, 'Files should contain only one element');
            expect(filesCalledWith[0].name).toBe('phobos.jpg', 'png file should be filtered out');
        });

        it('should filter out files, which are not part of the acceptedFilesType', () => {
            component.acceptedFilesType = '.jpg,.png';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(2, 'Files should contain two elements');
            expect(filesCalledWith[0].name).toBe('phobos.jpg');
            expect(filesCalledWith[1].name).toBe('deimos.png');
        });

        it('should not filter out anything if acceptedFilesType is wildcard', () => {
            component.acceptedFilesType = '*';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(3, 'Files should contain all elements');
            expect(filesCalledWith[0].name).toBe('phobos.jpg');
            expect(filesCalledWith[1].name).toBe('deimos.png');
            expect(filesCalledWith[2].name).toBe('ganymede.bmp');
        });

        it('should not add any file to que if everything is filtered out', () => {
            component.acceptedFilesType = 'doc';

            component.uploadFiles(files);

            expect(addToQueueSpy).not.toHaveBeenCalled();
        });
    });

    describe('Comments', () => {

        let addToQueueSpy;

        const files: File[] = [
            <File> { name: 'phobos.jpg' }
        ];

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should add the comment in the uploaded files', () => {
            component.comment = 'example-comment';

            component.uploadFiles(files);

            expect(addToQueueSpy).toHaveBeenCalledWith(new FileModel(files[0], {
                comment: 'example-comment',
                newVersion: false,
                majorVersion: false,
                parentId: '-root-',
                path: '',
                nodeType: 'cm:content'
            }));
        });
    });

    describe('Versions', () => {

        let addToQueueSpy;

        const files: File[] = [
            <File> { name: 'phobos.jpg' }
        ];

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should be a mahor version upload if majorVersion is true', () => {
            component.majorVersion = true;
            component.versioning = true;

            component.uploadFiles(files);

            expect(addToQueueSpy).toHaveBeenCalledWith(new FileModel(files[0], {
                comment: undefined,
                newVersion: true,
                majorVersion: true,
                parentId: '-root-',
                path: '',
                nodeType: 'cm:content'
            }));
        });

        it('should not  be a mahor version upload if majorVersion is false', () => {
            component.majorVersion = false;
            component.versioning = true;

            component.uploadFiles(files);

            expect(addToQueueSpy).toHaveBeenCalledWith(new FileModel(files[0], {
                comment: undefined,
                newVersion: true,
                majorVersion: false,
                parentId: '-root-',
                path: '',
                nodeType: 'cm:content'
            }));
        });
    });

    describe('Node Type', () => {

        let addToQueueSpy;

        const files: File[] = [
            <File> { name: 'process.pbmn' }
        ];

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should have custom nodeType if it is set', () => {
            component.nodeType = 'ama:process';

            component.uploadFiles(files);

            expect(addToQueueSpy).toHaveBeenCalledWith(new FileModel(files[0], {
                comment: undefined,
                newVersion: false,
                majorVersion: false,
                parentId: '-root-',
                path: '',
                nodeType: 'ama:process'
            }));
        });

        it('should have default nodeType if it is not set', () => {
            component.uploadFiles(files);

            expect(addToQueueSpy).toHaveBeenCalledWith(new FileModel(files[0], {
                comment: undefined,
                newVersion: false,
                majorVersion: false,
                parentId: '-root-',
                path: '',
                nodeType: 'cm:content'
            }));
        });
    });
});
