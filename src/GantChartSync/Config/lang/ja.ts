export const messages = {
    common_interpolation: (what: string, how: string) => `${what} is ${how}`,
    common_error_empty:  (what: string) => `${what} is empty!`,
    // 下記はexamples
    // interpolation: (what: string, how: string) => `${what} is ${how}`,
    // dateFormat: (date: Date) => `The current date is ${formatDate(date, 'MM/DD/YYYY')}`,
    // keyWithCount: (count: number) => `${count} item${count === 1 ? '' : 's'}`
};