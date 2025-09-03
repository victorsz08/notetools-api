import { subHours } from "date-fns";


export function dateNow(date: Date): Date {
    return subHours(date, 3);
};