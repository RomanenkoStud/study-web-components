import { css } from 'lit';

export const styles = css`
    :host {
        display: inline-block;
        position: relative;
        font-family: Arial, sans-serif;
    }

    .options-list {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        border-top: none;
        overflow-y: auto;
        z-index: 1000;
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: var(--maxHeight);
        transition: max-height 0.1s ease;
    }

    .hidden {
        max-height: 0;
        overflow: hidden;
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

    input {
        width: 100%;
        padding: 10px;
        outline: none;
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