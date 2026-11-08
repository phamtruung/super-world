// Helper = Pure Javascript

const Helper = {

    // #region Time
    Time:{
        compareDate(date1, date2) {
            const str1 = helperDateToString(date1);
            const str2 = helperDateToString(date2);
            return str1 === str2;
        },
        plusOneDay(date) {
            const rawDate = date instanceof Date ? date : new Date(date);
            const year = rawDate.getFullYear();
            const month = String(rawDate.getMonth() + 1).padStart(2, '0');
            const day = String(rawDate.getDate() + 1).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        dateToString(date) {
            const rawDate = date instanceof Date ? date : new Date(date);
            const year = rawDate.getFullYear();
            const month = String(rawDate.getMonth() + 1).padStart(2, '0');
            const day = String(rawDate.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        datetimeToString(datetime) {
            if (datetime === "") return "";
            const rawDate = datetime instanceof Date ? datetime : new Date(datetime);
            const year = rawDate.getFullYear();
            const month = String(rawDate.getMonth() + 1).padStart(2, '0');
            const day = String(rawDate.getDate()).padStart(2, '0');
            const hour = String(rawDate.getHours()).padStart(2, '0');
            const minute = String(rawDate.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hour}:${minute}`;
        },
        dateToStringMonth(date) {
            const rawDate = date instanceof Date ? date : new Date(date);
            const year = rawDate.getFullYear();
            const month = String(rawDate.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        },
        dateToStringWeek(date) {
            const rawDate = date instanceof Date ? date : new Date(date);

            let dayNum = rawDate.getDay();
            if (dayNum === 0) dayNum = 7; // Chủ Nhật = 7

            rawDate.setUTCDate(rawDate.getDate() + 4 - dayNum);

            const yearStart = new Date(rawDate.getFullYear(), 0, 1);
            const weekNo = Math.ceil((((rawDate - yearStart) / 86400000) + 1) / 7);
            const year = rawDate.getFullYear();

            // Format: W02-2026
            return `${year}-W${String(weekNo).padStart(2, '0')}`;
        },
        getDatesInMonth(year, monthStr) {
            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };

            const month = monthMap[monthStr];
            if (month === undefined) throw new Error("Tháng không hợp lệ");

            // Chuẩn hóa: tạo ngày đầu/cuối tháng ở 12:00 để tránh DST nhảy giờ
            const firstDay = this.dateToString(new Date(year, month, 1));
            const lastDay  = this.dateToString(new Date(year, month + 1, 1));

            const dates = [];

            let current = firstDay;
            while (new Date(current) <= new Date(lastDay)) {
                const dateStr = Helper.dateToString(current);
                dates.push(dateStr);
                current = this.plusOneDay(current)
            }
            return dates;
        },
        getWeeksInMonth(year, monthStr) {
            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };

            const month = monthMap[monthStr];
            if (month === undefined) throw new Error("Tháng không hợp lệ");

            // Chuẩn hóa: tạo ngày đầu/cuối tháng ở 12:00 để tránh DST nhảy giờ
            const firstDay = this.dateToString(new Date(year, month, 1));
            const lastDay  = this.dateToString(new Date(year, month + 1, 1));

            const weeks = [];

            let current = firstDay;
            while (new Date(current) <= new Date(lastDay)) {
                const weekStr = this.dateToStringWeek(current);
                if (!weeks.includes(weekStr)) weeks.push(weekStr);
                current = this.plusOneDay(current)
            }
            return weeks;
        },
        getDaysOfWeek(weekString) {
            const [yearStr, weekStr] = weekString.split("-W");
            const year = parseInt(yearStr, 10);
            const week = parseInt(weekStr, 10);

            const simple = new Date(year, 0, 4);
            const dayOfWeek = simple.getDay() || 7; // Chủ nhật = 0 → đổi thành 7
            // Lùi về thứ Hai của tuần 1
            const isoWeekStart = new Date(simple);
            isoWeekStart.setDate(simple.getDate() - dayOfWeek + 1);

            const weekStart = new Date(isoWeekStart);
            weekStart.setDate(isoWeekStart.getDate() + (week - 1) * 7);

            const days = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i);
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");
                days.push(`${yyyy}-${mm}-${dd}`);
            }

            return days;
        },
    },

    // #region String
    String: {
        UUID() {
            const time = Date.now().toString(36);
            const rand = Math.random().toString(36).substring(2, 4);
            return rand + time;
        },
        stringToSlug(text) {
            return text.toLowerCase().replace(/\s+/g, '-');
        },
        stringfromSlug(slug) {
            return slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },
        createStringFromCompare(prefixCSS, listOfValues, valueToCompare) {
            const compareValue = parseFloat(valueToCompare);

            if (
                valueToCompare === null ||
                valueToCompare === undefined ||
                isNaN(compareValue)
            ) {
                return null;
            }

            const maxLength =
                Math.max(...listOfValues)
                    .toString()
                    .length;

            for (const value of listOfValues) {

                if (compareValue <= value) {

                    const valueString =
                        value
                            .toString()
                            .padStart(
                                maxLength,
                                "0"
                            );

                    return `${prefixCSS}-${valueString}`;
                }
            }

            return `${prefixCSS}-max`;
        }
    },

    // #region Number
    Number:{
        average(arr) {
            if (!arr.length) return 0; // tránh chia cho 0
            const sum = arr.reduce((acc, val) => acc + val, 0);
            return sum / arr.length;
        },
        formatNumber(value) {
            return new Intl.NumberFormat("vi-VN")
            .format(Math.round(value));
        }
    },

    // #region Object
    Object: {
        compareObj(obj1, obj2) {
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);
            return (
                keys1.length === keys2.length &&
                keys1.every(key => keys2.includes(key))
            );
        },

        sortDictByKey(dict) {
            const output = {};

            Object.keys(dict)
                .sort((a, b) => a.localeCompare(b))
                .forEach(key => {
                    output[key] = dict[key];
                });

            return output;
        }
    },

    // #region Coordinate
    Coordinate: {
        convertToXY(longtitude, latitude) {
            const x = (longtitude + 180) * 5;
            const y = (90 - latitude) * 5;
            return [x, y]
        },
    },
}