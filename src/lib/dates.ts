type DateOrString = Date | string

// ISO 8601 format for Structured Data (https://en.wikipedia.org/wiki/ISO_8601)
export function machineDate(dateIso: DateOrString) {
	return new Date(dateIso).toISOString()
}

// e.g. Formats date to Oct 20, 2021
export function readableDate(dateIso: DateOrString) {
	return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(dateIso))
}
