import {
    convertDurationToInteger,
    convertHoursToSeconds,
    convertMinutesToSeconds,
    createTimeString,
    formatHours,
    formatTimeUnits,
    formatResizedPadding,
    getHours,
    getMinutes,
    getSeconds,
    handleOffsetParent,
    handlePaddingResize,
    hoursExist
} from '../src/js/lib/utilities';

describe('convertDurationToInteger', () => {
    it('should round down to the nearest integer', () => {
        expect(convertDurationToInteger(150.210)).toBe(150);
        expect(convertDurationToInteger(317.3)).toBe(317);
    });

    it('should round up to the nearest integer', () => {
        expect(convertDurationToInteger(14.5)).toBe(15);
        expect(convertDurationToInteger(72.75)).toBe(73);
    });
});

describe('convertHoursToSeconds', () => {
    it('should convert a number representing hours '
        + 'to an equal representation in seconds', () => {
        expect(convertHoursToSeconds(0)).toBe(0);
        expect(convertHoursToSeconds(1)).toBe(3600);
        expect(convertHoursToSeconds(2)).toBe(7200);
    });
});

describe('convertMinutesToSeconds', () => {
    it('should convert a number representing minutes '
        + 'to an equal representation in seconds', () => {
        expect(convertMinutesToSeconds(0)).toBe(0);
        expect(convertMinutesToSeconds(1)).toBe(60);
        expect(convertMinutesToSeconds(2)).toBe(120);
    });
});

describe('createTimeString', () => {
    it('should return a time string formatted hh:mm:ss when passed in a source '
        + 'with a duration of one hour or longer', () => {
        expect(createTimeString(3600)).toBe('01:00:00');
        expect(createTimeString(3667)).toBe('01:01:07');
        expect(createTimeString(36000)).toBe('10:00:00');
    });

    it('should return a time string formatted mm:ss when passed in a source '
        + 'with a duration of less than one hour', () => {
        expect(createTimeString(3599)).toBe('59:59');
        expect(createTimeString(150)).toBe('02:30');
        expect(createTimeString(16)).toBe('00:16');
    });
});

describe('formatHours', () => {
    it('should return "" if input is undefined', () => {
        expect(formatHours()).toBe('');
    });

    it('should return "" if input is 0', () => {
        expect(formatHours(0)).toBe('');
    });

    it('should return hours preceded by a 0 and suffixed with a : if input is single digit', () => {
        expect(formatHours(1)).toBe('01');
    });

    it('should return hours suffixed with a : if input is double digit', () => {
        expect(formatHours(10)).toBe('10');
    });
});

describe('formatTimeUnits', () => {
    it('should return the input preceded by a 0 if input is single digit', () => {
        expect(formatTimeUnits(1)).toBe('01');
    });

    it('should return the input if input is double digits', () => {
        expect(formatTimeUnits(10)).toBe('10');
    });
});

describe('formatResizedPadding', () => {
    it('should return an integer when passed in a string representing css padding', () => {
        expect(formatResizedPadding('0px')).toBe(0);
        expect(formatResizedPadding('10px')).toBe(10);
        expect(formatResizedPadding('100px')).toBe(100);
    });
});

describe('getHours', () => {
    it('should return 0 when a duration of under an hour (in seconds) is input', () => {
        expect(getHours(0)).toBe(0);
        expect(getHours(150)).toBe(0);
        expect(getHours(3599)).toBe(0);
    });

    it('should return a number of hours when supplied a duration of 3600 or over', () => {
        expect(getHours(3600)).toBe(1);
        expect(getHours(4800)).toBe(1);
        expect(getHours(7200)).toBe(2);
    });
});

describe('getMinutes', () => {
    it('should return remainder of minutes when passed in '
        + 'source duration and hours', () => {
        expect(getMinutes(150, 0)).toBe(2);
        expect(getMinutes(3750, 1)).toBe(2);
        expect(getMinutes(7350, 2)).toBe(2);
    });
});

describe('getSeconds', () => {
    it('should return remainder of seconds when passed in '
        + 'source duration, hours, and minutes', () => {
        expect(getSeconds(150, 0, 2)).toBe(30);
        expect(getSeconds(3750, 1, 2)).toBe(30);
        expect(getSeconds(7350, 2, 2)).toBe(30);
    });
});

describe('handleOffsetParent', () => {
    it('should return the combined value of all offsetParents until offsetParent is null', () => {
        const originNode = {
            offsetLeft: 0,
            offsetParent: {
                offsetLeft: 12,
                offsetParent: {
                    offsetLeft: 150,
                    offsetParent: {
                        offsetLeft: 40,
                        offsetParent: null
                    }
                }
            }
        };

        expect(handleOffsetParent(originNode)).toBe(162);
    });
});

describe('handlePaddingResize', () => {
    it('should return 0 if padding is an empty string', () => {
        expect(handlePaddingResize('')).toBe(0);
    });

    it('should return 0 if padding is undefined', () => {
        expect(handlePaddingResize()).toBe(0);
    });

    it('should return an integer representing padding '
        + 'if passed in a truthy padding string', () => {
        expect(handlePaddingResize('10px')).toBe(10);
    });
});

describe('hoursExist', () => {
    it('should return false if input is 0', () => {
        expect(hoursExist(0)).toBe(false);
    });

    it('should return false if input is undefined', () => {
        expect(hoursExist()).toBe(false);
    });

    it('should return true if input is greater than 0', () => {
        expect(hoursExist(1)).toBe(true);
    });
});