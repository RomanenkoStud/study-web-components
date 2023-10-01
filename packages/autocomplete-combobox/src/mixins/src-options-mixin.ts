import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

type Constructor<T> = new (...args: any[]) => T;

export declare class SrcDataInterface {
    src: string;
    debounceInput(): void;
    onLoad(data: any): void;
}

export const SrcDataMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class SrcDataElement extends superClass {
        @property({ type: Boolean }) loading = false;
        @property({ type: Boolean }) error = false;

        private _src = '';
        private _data = {};
        private fetchController?: AbortController;

        @property({ type: String })
        get src() {
            return this._src;
        }

        set src(newSrc: string) {
            if (newSrc === this._src) return;
    
            this._src = newSrc;
            this.loadDataFromSrc(newSrc);
        }

        get data() {
            return this._data;
        }

        debounceInput = (() => {
            let timeout: NodeJS.Timeout | null = null;
        
            return () => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.loadDataFromSrc(this.src);
                }, 300);
            };
        })();

        async loadDataFromSrc(src: string) {
            this.abortFetch();
        
            if (!src) {
                this._data = [];
                return;
            }
        
            this.loading = true;
        
            try {
                const response = await fetch(src, { signal: this.getAbortSignal() });
            
                if (!response.ok) {
                    console.error(`Failed to fetch data from ${src}`);
                }
            
                const data = await response.json();

                this.onLoad(data);
            
                this._data = data;
                this.error = false;
            } catch (error) {
                console.error(error);
                this._data = [];
                this.error = true;
            } finally {
                this.loading = false;
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

        disconnectedCallback() {
            super.disconnectedCallback();
            this.abortFetch();
        }

        onLoad(data: any) {
            this.dispatchEvent(new Event('load', {bubbles: true, composed: true}));
        }
    }

    return SrcDataElement as Constructor<SrcDataInterface> & T;
};