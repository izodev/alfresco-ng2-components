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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { SearchWidget } from '../../search-widget.interface';
import { SearchWidgetSettings } from '../../search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../search-query-builder.service';

@Component({
    selector: 'adf-search-check-list',
    templateUrl: './search-check-list.component.html',
    styleUrls: ['./search-check-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-check-list' }
})
export class SearchCheckListComponent implements SearchWidget, OnInit {

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: { name: string, value: string, checked: boolean }[] = [];
    operator: string = 'OR';

    ngOnInit(): void {
        if (this.settings) {
            this.operator = this.settings.operator || 'OR';

            if (this.settings.options && this.settings.options.length > 0) {
                this.options = [...this.settings.options];
            }
        }
    }

    changeHandler(event: MatCheckboxChange, option: any) {
        option.checked = event.checked;
        this.flush();
    }

    flush() {
        const checkedValues = this.options
            .filter(option => option.checked)
            .map(option => option.value);

        const query = checkedValues.join(` ${this.operator} `);

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = query;
            this.context.update();
        }
    }
}
