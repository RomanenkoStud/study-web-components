import { css } from 'lit';

export const styles = css`
    :host {
        display: inline-block;
        position: relative;
        font-family: Arial, sans-serif;
        line-height: 1.2; 
        font-size: 0.8rem
    }

    .options {
        position: absolute;
        width: 100%;
        top: 100%;
        left: 0;
        max-height: 150px;
    }

    @supports(anchor-name: --combobox) {
        [popovertarget] {
            anchor-name: --combobox;
        }

        [popover] {
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

    .options {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        border-top: none;
        overflow-y: auto;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #007BFF;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #0056b3;
    }

    ::-webkit-scrollbar-thumb:active {
        background-color: #00448c;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input:focus {
        outline: none;
        border-color: #007BFF;
    }

    .option {
        background-color: #fff;
        border: none;
        padding: 10px;
        cursor: pointer;
        text-align: left;
    }

    .option:hover, .option.focused {
        background-color: #c2b9b9;
    }
`;