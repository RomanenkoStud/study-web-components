# Simple Timestamp

## Introduction

The Simple Timestamp library provides a set of functions and a custom component for formatting and displaying timestamps in various formats. It allows you to easily display date in relative, time, and short formats.

## Installation

You can install the Simple Timestamp library via npm:

```bash
npm install @romanenko.pavlo/simple-timestamp
```

## Components

### SimpleTimestamp Component

The SimpleTimestamp component is a custom LitElement component for displaying formatted timestamps.

#### Attributes

- value: Date - The date value to be displayed. Default is current time.
- locale: String - The locale for formatting. Default is the user's browser locale.
- timezone: String - The timezone to use for formatting. Default is the user's browser timezone.
- label: String - A label to display before the timestamp.

## Functions

### formatTime(value: Date, locale: string, timezone: string): string

Formats a given date into a time format (e.g., '3:30 PM').

Parameters

- value: Date - The date to format.
- locale: String - The locale for formatting.
- timezone: String - The timezone to use for formatting.

### formatShortDate(value: Date, locale: string, timezone: string): string

Formats a given date into a short date format (e.g., 'Mar 29, 21').

Parameters

- value: Date - The date to format.
- locale: String - The locale for formatting.
- timezone: String - The timezone to use for formatting.

### formatRelativeDate(value: Date, locale: string): string

Formats a given date into a relative date format (e.g., '2 days ago').

Parameters

- value: Date - The date to format.
- locale: String - The locale for formatting.

## Authors

[RomanenkoStud](https://github.com/RomanenkoStud)