export {SimpleTimestamp} from "simple-timestamp";
export {NumericInput, DateInput} from "numeric-input";
export {AutocompleteCombobox} from "autocomplete-combobox";
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

// add options using js
const combobox = document.querySelector('#js-controlled-cb');
const options = ['red', 'green', 'blue']

if (combobox) {
    options.forEach((element) => {
        const option = document.createElement('option');
        option.value = element;
        combobox.appendChild(option);
    })

    setTimeout(() => {
        console.log(combobox.options)
    }, 0)
}
