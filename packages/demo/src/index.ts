// @ts-ignore
export {SimpleTimestamp} from "simple-timestamp";
// @ts-ignore
import {formatShortDate} from "simple-timestamp";

const currentDate = formatShortDate(new Date(), 'en-UK', 'UTC');
console.log(`Current date ${currentDate}`)
