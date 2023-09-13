import { css } from 'lit';

export const styles = css`
    :host {
        display: inline-block;
        position: relative;
        font-family: Arial, sans-serif;
    }

    .options {
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
`;