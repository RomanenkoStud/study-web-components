import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ComboboxKeyboardController } from '../controllers';
import { ComboboxElement } from '../combobox';
import { SrcDataMixin } from '../mixins';
import { Option } from '../types';

@customElement('autocomplete-combobox')
export class AutocompleteCombobox extends SrcDataMixin(ComboboxElement) {
    protected keyboardController = new ComboboxKeyboardController(this);

    @state() filterValue = '';

    onChange() {
        super.onChange();
        this.filterValue = this.value ? this.getOption(this.value).label : '';
    }

    onInput() {
        super.onInput();
        this.filterValue = this.inputElement.value;
        this.debounceInput();
    }

    onLoad(data: any) {
        super.onLoad(data);
        this.options = this.parseOptions(data) ?? [];
    }

    parseOptions(data: any): Option[]|undefined {
        if (Array.isArray(data)) {
            if (data.every((item) => typeof item === 'string')) {
                return data.map((item) => ({ label: item, value: item }));
            } else if(data.every((item) => typeof item === 'object')) {
                return data;
            }
        }
    }

    renderListbox(listboxId: string) {
        return html`
            <ul 
                popover="manual"
                id=${listboxId}
                part="listbox"
            >
                ${this.options
                    .filter(({label}) =>
                        label
                            .toLowerCase()
                            .includes(this.filterValue.toLowerCase())
                    )
                    .map((option) => this.renderOption(option))
                }
            </ul>
        `;
    }
}
