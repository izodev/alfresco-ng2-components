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

/*tslint:disable: ban*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentMetadataCardComponent } from './content-metadata-card.component';
import { ContentMetadataComponent } from '../content-metadata/content-metadata.component';
import { MatExpansionModule, MatCardModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { BasicPropertiesService } from '../../services/basic-properties.service';
import { PropertyGroupTranslatorService } from '../../services/property-groups-translator.service';
import { PropertyDescriptorsService } from '../../services/property-descriptors.service';
import { ContentMetadataConfigFactory } from '../../services/config/content-metadata-config.factory';

describe('ContentMetadataCardComponent', () => {

    let component: ContentMetadataCardComponent,
        fixture: ComponentFixture<ContentMetadataCardComponent>,
        node: MinimalNodeEntryEntity,
        preset = 'custom-preset';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatExpansionModule,
                MatCardModule,
                MatButtonModule,
                MatIconModule
            ],
            declarations: [
                ContentMetadataCardComponent,
                ContentMetadataComponent
            ],
            providers: [
                ContentMetadataService,
                BasicPropertiesService,
                PropertyGroupTranslatorService,
                ContentMetadataConfigFactory,
                PropertyDescriptorsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataCardComponent);
        component = fixture.componentInstance;
        node = <MinimalNodeEntryEntity> {
            aspectNames: [],
            nodeType: '',
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {}
        };

        component.node = node;
        component.preset = preset;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should have displayEmpty input param as false by default', () => {
        expect(component.displayEmpty).toBe(false);
    });

    it('should pass through the node to the underlying component', () => {
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.node).toBe(node);
    });

    it('should pass through the preset to the underlying component', () => {
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.preset).toBe(preset);
    });

    it('should pass through the preset to the underlying component', () => {
        component.displayEmpty = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.displayEmpty).toBe(true);
    });

    it('should pass through the editable to the underlying component', () => {
        component.editable = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.editable).toBe(true);
    });

    it('should pass through the multi to the underlying component', () => {
        component.multi = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.multi).toBe(true);
    });

    it('should pass through the expanded to the underlying component', () => {
        component.expanded = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.expanded).toBe(true);
    });

    it('should not show anything if node is not present', () => {
        component.node = undefined;
        fixture.detectChanges();

        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent));

        expect(contentMetadataComponent).toBeNull();
    });

    it('should toggle editable by clicking on the button', () => {
        component.editable = true;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-edit"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(component.editable).toBe(false);
    });

    it('should toggle expanded by clicking on the button', () => {
        component.expanded = true;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-expand"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(component.expanded).toBe(false);
    });

    it('should have the proper text on button while collapsed', () => {
        component.expanded = false;
        fixture.detectChanges();

        const buttonLabel = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-expand-label"]'));

        expect(buttonLabel.nativeElement.innerText.trim()).toBe('ADF_VIEWER.SIDEBAR.METADATA.MORE_INFORMATION');
    });

    it('should have the proper text on button while collapsed', () => {
        component.expanded = true;
        fixture.detectChanges();

        const buttonLabel = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-expand-label"]'));

        expect(buttonLabel.nativeElement.innerText.trim()).toBe('ADF_VIEWER.SIDEBAR.METADATA.LESS_INFORMATION');
    });

    it('should show the edit button by default', () => {
        const button = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-edit"]'));
        expect(button).not.toBeNull();
    });

    it('should hode the edit button in readOnly is true', () => {
        component.readOnly = true;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="mata-data-card-toggle-edit"]'));
        expect(button).toBeNull();
    });
});
