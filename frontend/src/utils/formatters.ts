export const formatPhoneNumber = (value: string): string => {
    // 1. Clean: remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // 2. Normalize: If it doesn't start with 56, assume it's a local 9-digit number and add 56. 
    // If it is 8 digits (old format), add 569.
    // If it starts with 56, keep it.
    let number = cleaned;

    // Handle scenarios
    if (number.startsWith('56')) {
        // already has country code
    } else if (number.startsWith('9') && number.length === 9) {
        // 9 1234 5678 -> add 56
        number = '56' + number;
    } else if (number.length === 8) {
        // 1234 5678 -> add 569 (assuming mobile)
        number = '569' + number;
    } else {
        // Default fallback, just use what we have, maybe it's incomplete
        // But if user wants +569 enforced, we try our best.
        if (!number.startsWith('56')) {
            number = '56' + number;
        }
    }

    // 3. Format: +569 1234 5678
    // Expecting 11 digits: 56 9 XXXX XXXX
    // but user might be typing, so we format partially.

    // Limits
    const maxLen = 11; // 56 9 1234 5678
    const limited = number.substring(0, maxLen);

    let formatted = '';
    if (limited.length > 0) formatted += '+' + limited.substring(0, 3); // +569
    if (limited.length > 3) formatted += ' ' + limited.substring(3, 7); // +569 1234
    if (limited.length > 7) formatted += ' ' + limited.substring(7, 11); // +569 1234 5678

    // If input is empty, return empty
    if (value === '') return '';

    return formatted;
};
