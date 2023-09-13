import { css } from 'lit';

export const styles = css`
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

    .option:hover, .option:focus {
        background-color: #c2b9b9;
    }
`;