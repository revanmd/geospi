export function FormatThousandDelimiter(number) {
    // Ensure the number is a valid string
    const [integerPart, decimalPart] = number.toString().split('.');
    
    // Format the integer part with thousand delimiters
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Reattach the decimal part if it exists
    return formattedInteger
}

export const GetNameKey = (value) => {
    if (value.length === 2) return 'WADMKK';
    if (value.length === 4) return 'WADMKC';
    if (value.length === 6) return 'WADMKD';
    return '';
};

export  const GetValueKey = (value) => {
    if (value.length === 2) return 'KDPKAB';
    if (value.length === 4) return 'KDCPUM';
    if (value.length === 6) return 'KDEPUM';
    return '';
};

export const GetPropertyByFilter = (commodity, fertilizer) => {
    if (commodity === "1" && fertilizer === "1") return "padi_urea";
    if (commodity === "1" && fertilizer === "2") return "padi_npk";
    if (commodity === "1" && fertilizer === "3") return "padi_organik";
    if (commodity === "2" && fertilizer === "1") return "jagung_urea";
    if (commodity === "2" && fertilizer === "2") return "jagung_npk";
    if (commodity === "2" && fertilizer === "3") return "jagung_organik";
    if (commodity === "3" && fertilizer === "1") return "tebu_urea";
    if (commodity === "3" && fertilizer === "2") return "tebu_npk";
    if (commodity === "3" && fertilizer === "3") return "tebu_organik";
    return "";
};

export const GetPropertyUmurByFilter = (umur) => {
    return "value_" + umur
};