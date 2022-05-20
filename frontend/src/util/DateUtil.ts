export function convertToDate(value: any) : Date | null {
    if (value instanceof Date) {
        return value;
    }
    if (value instanceof Array) {
        return new Date(
            value[0],
            value[1] - 1,
            value[2],
            value.length > 3 ? value[3] : 0,
            value.length > 4 ? value[4] : 0,
            value.length > 5 ? value[5] : 0,
            0
        );
    }
    return null;
}

export function dateToDay(date: Date) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

export function dateToTimeStr(date: Date) {
    return date.toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}
export function dateToDateStr(date: Date) {
    return date.toLocaleDateString('ro-ro', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
export function dateToDateTimeStr(date: Date) {
    return date.toLocaleDateString('ro-ro', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}