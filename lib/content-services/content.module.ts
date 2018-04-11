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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';

import { MaterialModule } from './material.module';

import { TagModule } from './tag/tag.module';
import { WebScriptModule } from './webscript/webscript.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { VersionManagerModule } from './version-manager/version-manager.module';
import { DialogModule } from './dialogs/dialog.module';
import { ContentMetadataModule } from './content-metadata/content-metadata.module';
import { PermissionManagerModule } from './permission-manager/permission-manager.module';
import { RatingService } from './social/services/rating.service';
import { ContentMetadataService } from './content-metadata/services/content-metadata.service';
import { PropertyDescriptorsService } from './content-metadata/services/property-descriptors.service';
import { ContentMetadataConfigFactory } from './content-metadata/services/config/content-metadata-config.factory';
import { BasicPropertiesService } from './content-metadata/services/basic-properties.service';
import { PropertyGroupTranslatorService } from './content-metadata/services/property-groups-translator.service';
import { SearchQueryBuilderService } from './search/search-query-builder.service';
import { ContentNodeSelectorPanelComponent } from './content-node-selector/content-node-selector-panel.component';
import { NameLocationCellComponent } from './content-node-selector/name-location-cell/name-location-cell.component';
import { ContentNodeSelectorComponent } from './content-node-selector/content-node-selector.component';
import { ContentNodeSelectorService } from './content-node-selector/content-node-selector.service';
import { ContentNodeDialogService } from './content-node-selector/content-node-dialog.service';
import { DocumentListComponent } from './document-list/components/document-list.component';
import { ContentColumnComponent } from './document-list/components/content-column/content-column.component';
import { ContentColumnListComponent } from './document-list/components/content-column/content-column-list.component';
import { ContentActionComponent } from './document-list/components/content-action/content-action.component';
import { ContentActionListComponent } from './document-list/components/content-action/content-action-list.component';
import { EmptyFolderContentDirective } from './document-list/components/empty-folder/empty-folder-content.directive';
import { NoPermissionContentDirective } from './document-list/components/no-permission/no-permission-content.directive';
import { DocumentListService } from './document-list/services/document-list.service';
import { FolderActionsService } from './document-list/services/folder-actions.service';
import { DocumentActionsService } from './document-list/services/document-actions.service';
import { NodeActionsService } from './document-list/services/node-actions.service';
import { CustomResourcesService } from './document-list/services/custom-resources.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DropdownBreadcrumbComponent } from './breadcrumb/dropdown-breadcrumb.component';
import { DropdownSitesComponent } from './site-dropdown/sites-dropdown.component';
import { FolderCreateDirective } from './folder-directive/folder-create.directive';
import { FolderEditDirective } from './folder-directive/folder-edit.directive';
import { NodeDownloadDirective } from './directives/node-download.directive';
import { NodeSharedDirective } from './directives/node-share.directive';
import { NodeLockDirective } from './directives/node-lock.directive';
import { RatingComponent } from './social/rating.component';
import { LikeComponent } from './social/like.component';

@NgModule({
    imports: [
        CoreModule,
        TagModule,
        CommonModule,
        WebScriptModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        SearchModule,
        UploadModule,
        MaterialModule,
        ContentMetadataModule,
        PermissionManagerModule,
        VersionManagerModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-content-services',
                source: 'assets/adf-content-services'
            }
        },
        ContentMetadataService,
        PropertyDescriptorsService,
        ContentMetadataConfigFactory,
        BasicPropertiesService,
        PropertyGroupTranslatorService,
        SearchQueryBuilderService,
        // Content Node Selector
        ContentNodeSelectorService,
        ContentNodeDialogService,
        // Document List
        DocumentListService,
        FolderActionsService,
        DocumentActionsService,
        NodeActionsService,
        CustomResourcesService,
        // Social
        RatingService
    ],
    declarations: [
        // Content Node Selector
        ContentNodeSelectorPanelComponent,
        NameLocationCellComponent,
        ContentNodeSelectorComponent,
        // Document List
        DocumentListComponent,
        ContentColumnComponent,
        ContentColumnListComponent,
        ContentActionComponent,
        ContentActionListComponent,
        EmptyFolderContentDirective,
        NoPermissionContentDirective,
        // Breadcrumb
        BreadcrumbComponent,
        DropdownBreadcrumbComponent,
        // Sites Dropdown
        DropdownSitesComponent,
        // Folder Directive
        FolderCreateDirective,
        FolderEditDirective,
        // Content Directives
        NodeDownloadDirective,
        NodeSharedDirective,
        NodeLockDirective,
        // Social
        RatingComponent,
        LikeComponent
    ],
    entryComponents: [
        ContentNodeSelectorPanelComponent,
        ContentNodeSelectorComponent
    ],
    exports: [
        CoreModule,
        TagModule,
        WebScriptModule,
        UploadModule,
        SearchModule,
        ContentMetadataModule,
        DialogModule,
        PermissionManagerModule,
        VersionManagerModule,
        // Content Node Selector
        ContentNodeSelectorPanelComponent,
        NameLocationCellComponent,
        ContentNodeSelectorComponent,
        // Document List
        DocumentListComponent,
        ContentColumnComponent,
        ContentColumnListComponent,
        ContentActionComponent,
        ContentActionListComponent,
        EmptyFolderContentDirective,
        NoPermissionContentDirective,
        // Breadcrumb
        BreadcrumbComponent,
        DropdownBreadcrumbComponent,
        // Sites Dropdown
        DropdownSitesComponent,
        // Folder Directive
        FolderCreateDirective,
        FolderEditDirective,
        // Content Directives
        NodeDownloadDirective,
        NodeSharedDirective,
        NodeLockDirective,
        // Social
        RatingComponent,
        LikeComponent
    ]
})
export class ContentModule {
}
