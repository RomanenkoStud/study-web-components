export * from './numeric-input';
export * from './date-input';
export * from './utils';

/*
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
*/
