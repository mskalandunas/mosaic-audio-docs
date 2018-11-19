export const handleOffsetParent = originNode => {
    let n = originNode;
    let o = 0;

    while (n.offsetParent !== null) {
        o = o + n.offsetLeft;
        n = n.offsetParent;
    }

    return o;
};

const convertDurationToInteger = duration => parseInt(duration, 10);

const getHours = duration => Math.floor(duration / 3600);

const getMinutes = (duration, hours) => Math.floor((duration - (hours * 3600)) / 60);

const getSeconds = (duration, hours, minutes) => duration - (hours * 3600) - (minutes * 60);

const hoursExist = hours => hours < 10 && hours > 0;

const formatHours = hours => hoursExist(hours) ? hours = '0' + hours + ':' : hours = '';

const formatNonHourTimeUnits = (timeAmount = 0) => timeAmount < 10 ? '0' + timeAmount : timeAmount;

const formatResizedPadding = padding => parseInt(padding.substring(0, padding.length - 2), 10);

export const handleTime = duration => {
    let durationAsInteger = convertDurationToInteger(duration);
    let hours = getHours(durationAsInteger);
    let minutes = getMinutes(durationAsInteger, hours);
    let seconds = getSeconds(durationAsInteger, hours, minutes);

    return formatHours(hours)
        + formatNonHourTimeUnits(minutes)
        + ':'
        + formatNonHourTimeUnits(seconds);
};

export const handlePaddingResize = padding =>
    padding === '' ? 0 : formatResizedPadding(padding);

export const newId = prefix => `${prefix}${(new Date()).getTime()}`;