import { DateTime } from "luxon"

// ISO 8601 format for Structured Data (https://en.wikipedia.org/wiki/ISO_8601)
export function machineDate(dateIso: Date) {
	return DateTime.fromISO(dateIso).toFormat("yyyy-MM-dd")
}

// e.g. Formats date to Oct 20, 2021
export function readableDate(dateIso: Date) {
	return DateTime.fromISO(dateIso).toFormat("LLL dd, yyyy")
}
