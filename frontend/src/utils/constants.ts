import type { SelectOption } from "../models/components";

export const years: SelectOption[] = Array.from({ length: 2025 - 1905 + 1 }, (_, i) => ({
    text: `${1905 + i}`,
    value: `${1905 + i}`,
}));

export const days: SelectOption[] = Array.from({ length: 31 }, (_, i) => ({
    text: `${i + 1}`,
    value: `${i + 1}`,
}));

export const months: SelectOption[] = [
    { text: "January", value: "1" },
    { text: "February", value: "2" },
    { text: "March", value: "3" },
    { text: "April", value: "4" },
    { text: "May", value: "5" },
    { text: "June", value: "6" },
    { text: "July", value: "7" },
    { text: "August", value: "8" },
    { text: "September", value: "9" },
    { text: "October", value: "10" },
    { text: "November", value: "11" },
    { text: "December", value: "12" },
];