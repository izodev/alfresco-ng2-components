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

/* tslint:disable:component-selector no-access-missing-member no-input-rename  */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuButton } from './menu-button.model';

@Component({
    selector: 'adf-buttons-action-menu',
    templateUrl: './buttons-menu.component.html'
})

export class ButtonsMenuComponent implements OnChanges {
    @Input() buttons: MenuButton[];

    ngOnChanges(changes: SimpleChanges) {
        this.buttons = changes['buttons'].currentValue;
        console.log(this.buttons);
    }
}
