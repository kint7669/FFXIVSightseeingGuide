import EorzeaClock from "./EorzeaTime";
import EorzeaWeather from "./EorzeaWeather";

export interface ISightseeingGroup {
    groupName: string;
    items: ISightseeingItem[];
}

export interface ISightseeingItem {
    id: string;
    area: string;
    subarea?: string;
    pos: IPos;
    weather: string;
    time: number[];
    timestr: string;
    action: string;
    startHour: number;
    endHour: number;
}

export interface IPos {
    x: number;
    y: number;
}

export class Sightseeing {
    id: string;
    area: string;
    subarea?: string;
    pos: IPos;
    weather: string;
    time: number[];
    timestr: string;
    action: string;
    nextAvaliableTime: EorzeaClock = new EorzeaClock(undefined);
    nextAvaliableTimeEnd?: EorzeaClock;
    nextAvaliableTimeLeft?: number;
    vaildStatus: string = "";
    isStillWaiting: boolean = false;
    startHour: number;
    endHour: number;
    constructor(item: ISightseeingItem) {
        this.id = item.id;
        this.area = item.area;
        this.subarea = item.subarea;
        this.pos = item.pos;
        this.weather = item.weather;
        this.time = item.time;
        this.timestr = item.timestr;
        this.action = item.action;
        this.startHour = item.startHour;
        this.endHour = item.endHour;
    }
    calcNextAvailableTime(): void {
        let nowet: EorzeaClock = new EorzeaClock(undefined);
        let baseTime: EorzeaClock = EorzeaWeather.calcBaseDate(nowet);
        for (let i: number = 0; i < 10000; i++) {
            let forecastSeed: number[] = EorzeaWeather.forecastSeed(baseTime, [i]);
            let forecast: string = EorzeaWeather.getForecast(this.area, forecastSeed)[0];
            if (this.weather === forecast) {
                // 天气匹配成功
                let weatherAvaliableTime: number[] = Array.from(
                    { length: 8 },
                    (_, index: number) => index + baseTime.addHours(i * 8).getHours()
                );
                if (i === 0) {
                    let invaildEnd: number = nowet.getHours() - baseTime.getHours();
                    weatherAvaliableTime.splice(0, invaildEnd);
                }
                let vaildTimes: number[] = this.time.filter(t => weatherAvaliableTime.indexOf(t) !== -1); // calc intersection
                if (vaildTimes.length !== 0) {
                    // 时间匹配成功
                    vaildTimes.sort((a, b) => a - b);

                    this.nextAvaliableTime = baseTime.addHours(i * 8);
                    this.nextAvaliableTime.date.setUTCHours(vaildTimes[0]);

                    this.nextAvaliableTimeEnd = baseTime.addHours(i * 8);
                    let nextAvaliableTimeEnd: number = this.endHour;
                    if (nextAvaliableTimeEnd < vaildTimes[0]) { nextAvaliableTimeEnd += 24; }
                    this.nextAvaliableTimeEnd.date.setUTCHours(nextAvaliableTimeEnd);

                    this.nextAvaliableTimeLeft = parseInt(
                        (this.nextAvaliableTimeEnd.getLocalTime().getTime() - nowet.getLocalTime().getTime())
                        / 1000 / 60 + "", undefined);

                    if (i === 0) {
                        let nowHour: number = nowet.getHours();
                        if (baseTime.getHours() === 0 && this.startHour > 8) { nowHour += 24; }
                        if (this.startHour > nowHour) { this.isStillWaiting = true; }
                        this.vaildStatus = "card-primary";
                    } else if (i <= 3) {
                        this.vaildStatus = "card-info";
                    } else if (i <= 6) {
                        this.vaildStatus = "card-secondary";
                    } else {
                        this.vaildStatus = "card-default";
                    }
                    return;
                }
            }
        }
        this.nextAvaliableTime = baseTime.addHours(50 * 8);
        this.vaildStatus = "card-danger";
    }
}

// tslint:disable:max-line-length
export const SightseeingData: ISightseeingGroup[] = [
    {
        groupName: "1~20",
        items: [
            { id: "1", area: "area.LimsaLominsa", subarea: "area.LimsaLominsaUpper", pos: { x: 9.7, y: 7.7 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "2", area: "area.LimsaLominsa", subarea: "area.LimsaLominsaLower", pos: { x: 7, y: 15.1 }, weather: "weather.ClearSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "3", area: "area.MiddleLa", pos: { x: 20, y: 19 }, weather: "weather.Rain", time: [5, 6, 7], action: "action.Pray", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "4", area: "area.MiddleLa", pos: { x: 16, y: 17 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "5", area: "area.MiddleLa", pos: { x: 25.3, y: 27.5 }, weather: "weather.Clouds", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "6", area: "area.LowerLa", pos: { x: 23, y: 40 }, weather: "weather.FairSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "7", area: "area.LowerLa", pos: { x: 33, y: 19 }, weather: "weather.Fog", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "8", area: "area.WesternLa", pos: { x: 29.9, y: 30.7 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "9", area: "area.Gridania", subarea: "area.OldGridania", pos: { x: 12, y: 8 }, weather: "weather.Clouds", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "10", area: "area.Gridania", subarea: "area.OldGridania", pos: { x: 10, y: 16 }, weather: "weather.ClearSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "11", area: "area.CentralShroud", pos: { x: 21.8, y: 21.8 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Sit", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "12", area: "area.EastShroud", pos: { x: 17, y: 18 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Pray", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "13", area: "area.EastShroud", pos: { x: 22, y: 26 }, weather: "weather.ClearSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "14", area: "area.Uldah", subarea: "area.UldahThal", pos: { x: 11, y: 11 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Salute", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "15", area: "area.Uldah", subarea: "area.UldahThal", pos: { x: 11, y: 11 }, weather: "weather.Clouds", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "16", area: "area.WesternThanalan", pos: { x: 22, y: 22 }, weather: "weather.FairSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "17", area: "area.CentralThanalan", pos: { x: 15, y: 22 }, weather: "weather.Fog", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "18", area: "area.EasternThanalan", pos: { x: 19, y: 24 }, weather: "weather.Rain", time: [17], action: "action.Comfort", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "19", area: "area.EasternThanalan", pos: { x: 14, y: 18 }, weather: "weather.Clouds", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "20", area: "area.EasternThanalan", pos: { x: 21, y: 20.8 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Pray", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
        ],
    },
    {
        groupName: "21~80",
        items: [
            { id: "21", area: "area.MiddleLa", pos: { x: 20, y: 13 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "22", area: "area.MiddleLa", pos: { x: 25, y: 17 }, weather: "weather.ClearSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "23", area: "area.LowerLa", pos: { x: 31, y: 12 }, weather: "weather.Rain", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "24", area: "area.EasternLa", pos: { x: 32, y: 23 }, weather: "weather.ClearSkies", time: [8, 9, 10, 11], action: "action.Sit", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "25", area: "area.EasternLa", pos: { x: 29, y: 33 }, weather: "weather.Rain", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "26", area: "area.WesternLa", pos: { x: 26, y: 26 }, weather: "weather.ClearSkies", time: [17], action: "action.Pray", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "27", area: "area.WesternLa", pos: { x: 17, y: 36 }, weather: "weather.Gales", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "28", area: "area.WesternLa", pos: { x: 22, y: 22 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "29", area: "area.WesternLa", pos: { x: 19, y: 23 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "30", area: "area.UpperLa", pos: { x: 30, y: 22 }, weather: "weather.FairSkies", time: [17], action: "action.Lookout", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "31", area: "area.UpperLa", pos: { x: 12, y: 22 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "32", area: "area.UpperLa", pos: { x: 29, y: 25 }, weather: "weather.Thunderstorms", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "33", area: "area.OuterLa", pos: { x: 12, y: 15 }, weather: "weather.FairSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "34", area: "area.OuterLa", pos: { x: 17, y: 16 }, weather: "weather.Clouds", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "35", area: "area.OuterLa", pos: { x: 23, y: 11 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "36", area: "area.OuterLa", pos: { x: 15, y: 10 }, weather: "weather.Rain", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Sit", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "37", area: "area.Gridania", subarea: "area.NewGridania", pos: { x: 14, y: 14 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "38", area: "area.Gridania", subarea: "area.OldGridania", pos: { x: 14, y: 5 }, weather: "weather.Rain", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "39", area: "area.CentralShroud", pos: { x: 23, y: 19 }, weather: "weather.Rain", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "40", area: "area.CentralShroud", pos: { x: 13, y: 23 }, weather: "weather.ClearSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "41", area: "area.CentralShroud", pos: { x: 16, y: 22 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "42", area: "area.CentralShroud", pos: { x: 26, y: 18 }, weather: "weather.ClearSkies", time: [11, 12, 13], action: "action.Lookout", timestr: "11:00~14:00", startHour: 11, endHour: 14 },
            { id: "43", area: "area.EastShroud", pos: { x: 21, y: 10 }, weather: "weather.Thunder", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "44", area: "area.SouthShroud", pos: { x: 17, y: 20 }, weather: "weather.Thunderstorms", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "45", area: "area.SouthShroud", pos: { x: 14, y: 33 }, weather: "weather.ClearSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "46", area: "area.SouthShroud", pos: { x: 33, y: 23 }, weather: "weather.Fog", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "47", area: "area.SouthShroud", pos: { x: 25, y: 21 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "48", area: "area.NorthShroud", pos: { x: 18, y: 19 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "49", area: "area.NorthShroud", pos: { x: 15, y: 32 }, weather: "weather.ClearSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "50", area: "area.NorthShroud", pos: { x: 15, y: 27 }, weather: "weather.Clouds", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "51", area: "area.WesternThanalan", pos: { x: 8, y: 5 }, weather: "weather.ClearSkies", time: [17], action: "action.Lookout", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "52", area: "area.WesternThanalan", pos: { x: 12, y: 14 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Point", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "53", area: "area.CentralThanalan", pos: { x: 21, y: 17 }, weather: "weather.DustStorms", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "54", area: "area.CentralThanalan", pos: { x: 18, y: 26 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Sit", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "55", area: "area.EasternThanalan", pos: { x: 30, y: 26 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "56", area: "area.EasternThanalan", pos: { x: 10, y: 16 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "57", area: "area.EasternThanalan", pos: { x: 25, y: 14 }, weather: "weather.Showers", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Pray", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "58", area: "area.SouthernThanalan", pos: { x: 12, y: 22 }, weather: "weather.Fog", time: [5, 6, 7], action: "action.Pray", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "59", area: "area.SouthernThanalan", pos: { x: 19, y: 20 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "60", area: "area.SouthernThanalan", pos: { x: 21, y: 38 }, weather: "weather.HeatWaves", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "61", area: "area.SouthernThanalan", pos: { x: 23, y: 11 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "62", area: "area.SouthernThanalan", pos: { x: 14, y: 26 }, weather: "weather.HeatWaves", time: [5, 6, 7], action: "action.Psych", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "63", area: "area.NorthernThanalan", pos: { x: 21, y: 24 }, weather: "weather.ClearSkies", time: [5, 6, 7], action: "action.Salute", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "64", area: "area.NorthernThanalan", pos: { x: 20, y: 29 }, weather: "weather.FairSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "65", area: "area.NorthernThanalan", pos: { x: 20, y: 22 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "66", area: "area.NorthernThanalan", pos: { x: 19, y: 17 }, weather: "weather.Clouds", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "67", area: "area.NorthernThanalan", pos: { x: 26, y: 22 }, weather: "weather.Fog", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "68", area: "area.CoerthasCentral", pos: { x: 25, y: 29 }, weather: "weather.ClearSkies", time: [17], action: "action.Lookout", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "69", area: "area.CoerthasCentral", pos: { x: 25, y: 29 }, weather: "weather.Fog", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "70", area: "area.CoerthasCentral", pos: { x: 11, y: 15 }, weather: "weather.Blizzards", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "71", area: "area.CoerthasCentral", pos: { x: 12, y: 17 }, weather: "weather.FairSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "72", area: "area.CoerthasCentral", pos: { x: 7, y: 28 }, weather: "weather.ClearSkies", time: [17], action: "action.Lookout", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
            { id: "73", area: "area.CoerthasCentral", pos: { x: 7, y: 31 }, weather: "weather.Blizzards", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "74", area: "area.CoerthasCentral", pos: { x: 2, y: 21 }, weather: "weather.FairSkies", time: [8, 9, 10, 11], action: "action.Lookout", timestr: "8:00~12:00", startHour: 8, endHour: 12 },
            { id: "75", area: "area.CoerthasCentral", pos: { x: 26, y: 17 }, weather: "weather.FairSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "76", area: "area.CoerthasCentral", pos: { x: 28, y: 10 }, weather: "weather.ClearSkies", time: [5, 6, 7], action: "action.Lookout", timestr: "5:00~8:00", startHour: 5, endHour: 8 },
            { id: "77", area: "area.MorDhona", pos: { x: 9, y: 13 }, weather: "weather.Gloom", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "78", area: "area.MorDhona", pos: { x: 27, y: 8 }, weather: "weather.FairSkies", time: [0, 1, 2, 3, 4, 18, 19, 20, 21, 22, 23], action: "action.Lookout", timestr: "18:00~5:00", startHour: 18, endHour: 5 },
            { id: "79", area: "area.MorDhona", pos: { x: 18, y: 17 }, weather: "weather.ClearSkies", time: [12, 13, 14, 15, 16], action: "action.Lookout", timestr: "12:00~17:00", startHour: 12, endHour: 17 },
            { id: "80", area: "area.MorDhona", pos: { x: 26, y: 11 }, weather: "weather.FairSkies", time: [17], action: "action.Sit", timestr: "17:00~18:00", startHour: 17, endHour: 18 },
        ],
    },
];
// tslint:enable:max-line-length
