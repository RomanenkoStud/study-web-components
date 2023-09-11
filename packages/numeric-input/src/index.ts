export * from './numeric-input';
export * from './date-input';
export * from './utils';

/*
import {NumericInputElement} from './numeric-input';
import {DateInputElement} from './date-input';
import {formatDate} from './utils';

const dateInput: DateInputElement | null = document.querySelector('date-input#now');

// read valueAsDate from value
dateInput?.addEventListener('input', (e) => {
    const inputElement = e.target as DateInputElement;
    console.log('Selected Date:', formatDate(inputElement.value));
});

// write valueAsDate using value
if(dateInput) {
    dateInput.value = new Date();
    console.log('New Date:', formatDate(dateInput.value));
}

const numericInput: NumericInputElement | null = document.querySelector('numeric-input#usd');

// read valueAsDate from value
numericInput?.addEventListener('format', (e) => {
    const inputElement = e.target as HTMLInputElement;
    console.log('Numeric Value:', inputElement.value);
});

// write valueAsDate using value
if(numericInput) {
    numericInput.value = "22211";
    console.log('New value raw:', numericInput.raw);
    console.log('Formated value:', numericInput.value);
}
*/
