import { toWords } from 'number-to-words';

export const convertToWords = (amount) => {
    const [dollars, cents] = parseFloat(amount).toFixed(2).split('.');
    const dollarWords = toWords(dollars);
    const centWords = toWords(cents);
    let final  = `${dollarWords} point ${centWords} paisa`.replace(/-/g, ' ');
    return final;
};