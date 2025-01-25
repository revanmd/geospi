export function FormatThousandDelimiter(number) {
    // Convert the number to a string and add thousand delimiters
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
