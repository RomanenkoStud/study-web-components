// @ts-ignore
export {SimpleTimestamp} from "simple-timestamp";
// @ts-ignore
export {NumericInput, DateInput} from "numeric-input";
// @ts-ignore
import {formatShortDate} from "simple-timestamp";

const currentDate = formatShortDate(new Date(), 'en-UK', 'UTC');
console.log(`Current date ${currentDate}`)
