import { css } from 'lit';

export const styles = css`    
    :host {
        display: inline-block;
        font-family: Arial, sans-serif;
        line-height: 1.2; 
        font-size: 0.8rem;

        --text-color: #000;
        --scrollbar-track-color: #fff;
        --scrollbar-thumb-color: #5a5a5a;
        --scrollbar-thumb-radius: 5px;
        --scrollbar-width: 10px;
        --listbox-border: #333;
        --option-background: #fff;
        --input-background: #fff;
    }

    @media (prefers-color-scheme: dark) {
        /* Dark mode styles */
        :host {
            --scrollbar-track-color: #000000;
            --scrollbar-thumb-color: #888;
            --option-background: #444;
            --text-color: #fff;
            --listbox-border: #fff;
            --input-background: #444;
        }
    }

    :host::part(input) {
        background-color: var(--input-background);
        color: var(--text-color);
    }

    [popover] {
        position: absolute;
    }

    @supports(anchor-name: --combobox) {
        [popovertarget] {
            anchor-name: --combobox;
        }

        [popover] {
            position: fixed;
            anchor-default: --combobox;
            left: anchor(left);
            width: anchor-size(width);
            position-fallback: --flip;
        }

        @position-fallback --flip {
            @try {
                top: anchor(bottom);
                bottom: auto;
            }
            @try {
                bottom: anchor(top);
                top: auto;
            }
        }
    }

    :host::part(listbox) {
        box-sizing: border-box;
        overflow-y: auto;
        list-style: none;
        padding: 0;
        margin: 0;
        border: 1px solid var(--listbox-border);
        border-radius: 4px;
        max-height: 150px;
        scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
    }

    ::-webkit-scrollbar {
        width: var(--scrollbar-width);
        background-color: var(--scrollbar-track-color);
    }

    ::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb-color);
        border-radius: var(--scrollbar-thumb-radius);
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: color-mix(in srgb, var(--scrollbar-thumb-color) 50%, white);
    }

    ::-webkit-scrollbar-thumb:active {
        background-color: var(--scrollbar-thumb-color);
    }

    :host::part(option) {
        background-color: var(--option-background);
        color: var(--text-color);
        cursor: pointer;
    }

    :host::part(option):hover {
        background-color: color-mix(in srgb, var(--option-background) 50%, black);
    }
    
    :host::part(option-focused) {
        background-color: color-mix(in srgb, var(--option-background) 50%, black);
    }

    :host::part(option-disabled),
    :host::part(option-disabled):hover {
        background-color: color-mix(in srgb, var(--option-background) 75%, black) !important;
        cursor: default
    }

    @media (prefers-color-scheme: dark) {
        :host::part(option):hover {
            background-color: color-mix(in srgb, var(--option-background) 50%, white);
            cursor: pointer;
        }
        
        :host::part(option-focused) {
            background-color: color-mix(in srgb, var(--option-background) 50%, white);
        }

        :host::part(option-disabled),
        :host::part(option-disabled):hover {
            background-color: color-mix(in srgb, var(--option-background) 75%, white);
            cursor: default;
        }
    }
`;