import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Option } from '../types';

type Constructor<T> = new (...args: any[]) => T;

export declare class SrcOptionsInterface {
    src: string;
    options: Option[];
    getOption(value: string): Option;
    debounceInput(): void;
}

export const SrcOptionsMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class SrcOptionsElement extends superClass {
        @property({ type: Boolean }) loading = false;
        @property({ type: Boolean }) error = false;

        private _src = '';
        protected _options: Record<string, Option> = {};
        private fetchController?: AbortController;

        @property({ type: Array })
        set options(newOptions: Option[]) {
            this._options = newOptions.reduce((acc, option) => {
                if (option.value === undefined || option.label === undefined) {
                    console.warn(`Option with invalid structure: ${JSON.stringify(option)}`);
                } else if (acc.hasOwnProperty(option.value)) {
                    console.warn(`Option with value "${option.value}" already exists.`);
                } else {
                    acc[option.value] = option;
                }
                return acc;
            }, {} as Record<string, Option>);
        
            this.requestUpdate("options");
        }

        get options() {
            return Object.values(this._options);
        }

        @property({ type: String })
        get src() {
            return this._src;
        }

        set src(newSrc: string) {
            if (newSrc === this._src) return;
    
            this._src = newSrc;
            this.loadOptionsFromSrc(newSrc);
        }

        debounceInput = (() => {
            let timeout: NodeJS.Timeout | null = null;
        
            return () => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    console.log("loaded")
                    this.loadOptionsFromSrc(this.src);
                }, 300);
            };
        })();

        async loadOptionsFromSrc(src: string) {
            this.abortFetch();
        
            if (!src) {
                this.options = [];
                return;
            }
        
            this.loading = true;
        
            try {
                const response = await fetch(src, { signal: this.getAbortSignal() });
            
                if (!response.ok) {
                    throw new Error(`Failed to fetch options from ${src}`);
                }
            
                const data = await response.json();
                const parsedOptions = this.parseOptions(data) ?? [];
            
                this.options = parsedOptions;
                this.error = false;
            } catch (error) {
                console.error(error);
                this.options = [];
                this.error = true;
            } finally {
                this.loading = false;
            }
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

        getAbortSignal() {
            if (!this.fetchController) {
                this.fetchController = new AbortController();
            }
            return this.fetchController.signal;
        }

        abortFetch() {
            if (this.fetchController) {
                this.fetchController.abort();
                this.fetchController = undefined;
            }
        }

        getOption(value: string): Option {
            return this._options[value];
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            this.abortFetch();
        }
    }

    return SrcOptionsElement as Constructor<SrcOptionsInterface> & T;
};