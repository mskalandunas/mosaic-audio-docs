export const delimiter = (unit, delimiter = ':') => unit ? delimiter : '';

export const convertDurationToInteger = duration => Math.round(duration);

export const convertHoursToSeconds = hours => hours * 3600;

export const convertMinutesToSeconds = minutes => minutes * 60;

export const createTimeString = duration => {
    const durationAsInteger = convertDurationToInteger(duration);
    const hours = getHours(durationAsInteger);
    const minutes = getMinutes(durationAsInteger, hours);
    const seconds = getSeconds(durationAsInteger, hours, minutes);

    return formatHours(hours)
        + delimiter(hours)
        + formatTimeUnits(minutes)
        + ':'
        + formatTimeUnits(seconds);
};

export const formatHours = hours => hoursExist(hours) ? formatTimeUnits(hours) : '';

export const formatTimeUnits = (timeAmount = 0) =>
    timeAmount < 10
        ? '0' + timeAmount
        : '' + timeAmount;

export const formatResizedPadding = padding =>
    parseInt(padding.substring(0, padding.length - 2), 10);

export const getHours = duration => Math.floor(duration / 3600);

export const getMinutes = (duration, hours) => Math.floor((duration - (hours * 3600)) / 60);

export const getSeconds = (duration, hours, minutes) =>
    duration - (convertHoursToSeconds(hours)) - (convertMinutesToSeconds(minutes));

export const handleOffsetParent = originNode => {
    let n = originNode;
    let o = 0;

    while (n.offsetParent !== null) {
        o = o + n.offsetLeft;
        n = n.offsetParent;
    }

    return o;
};

export const handlePaddingResize = (padding = '') =>
    padding === '' ? 0 : formatResizedPadding(padding);

export const hoursExist = (hours = 0) => hours > 0;