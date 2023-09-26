import { css } from 'lit';

export const styles = css`
    /* Chrome, Safari, Edge, Opera */
    :host(.no-spinner) input[type=number]::-webkit-outer-spin-button,
    :host(.no-spinner) input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    :host(.no-spinner) input[type=number] {
        -moz-appearance: textfield;
    }
`;