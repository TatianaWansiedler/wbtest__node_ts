/**
 * Converts a Date object to a formatted string in the "yyyy-mm-dd" format.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string in the format "yyyy-mm-dd".
 */
export const getStringDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

