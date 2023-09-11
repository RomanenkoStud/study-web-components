export {SimpleTimestamp} from "simple-timestamp";
export {NumericInput, DateInput} from "numeric-input";
import {formatShortDate} from "simple-timestamp";


const currentDate = formatShortDate(new Date(), 'en-UK', 'UTC');
console.log(`Current date ${currentDate}`)

const dateInput = document.querySelector('date-input#js-controlled');

const displayDate = (value) => {
    const dateMessage = document.querySelector('p#input-date');
    dateMessage.textContent = `${value}`; 
}

// read valueAsDate from value
dateInput?.addEventListener('input', (e) => {
    const inputElement = e.target;
    displayDate(inputElement.value);
});

// write valueAsDate using value
if(dateInput) {
    dateInput.value = new Date();
    displayDate(dateInput.value);
}
