---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-29
---

# Widget component

Base class for standard and custom widget classes.

## Basic Usage

```ts
import { Component } from '@angular/core';
import { WidgetComponent } from '@alfresco/adf-core';

@Component({
    selector: 'custom-editor',
    template: `
        <div style="color: red">Look, I'm a custom editor!</div>
    `
})
export class CustomEditorComponent extends WidgetComponent {}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| field | `FormFieldModel` |  | Data to be displayed in the field |
| readOnly | `boolean` | false | Does the widget show a read-only value? (ie, can't be edited) |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| fieldChanged | `EventEmitter<FormFieldModel>` | **Deprecated:** Used only to trigger visibility engine; components should do that internally if needed |

## Details

The Widget component is the base class for all standard and custom form widgets. See the
[Form Extensibility and Customisation](../user-guide/extensibility.md) page for full details about
implementing custom widgets.

## See also

-   [Extensibility](../user-guide/extensibility.md)
