import { useContext } from "react";

import "./RenderCalender.scss";
import MainContext from "../contexts/MainContext";
import moment from "moment";

const RenderCalender = () => {
    const mainContext = useContext(MainContext);
    const { todayDate } = mainContext.state;

    const today = todayDate;
    const firstWeek = today.clone().startOf("month").week();
    const lastWeek =
        today.clone().endOf("month").week() === 1
            ? 53
            : today.clone().endOf("month").week();

    let result: any = [];
    let week = firstWeek;

    const returnResult = (
        days: moment.Moment,
        index: number,
        format: string
    ) => {
        return (
            <div className="dateArea" key={index}>
                <p className="date">{format}</p>
                <p
                    className={`displayNoticeArea date${days.format("MMDD")}`}
                ></p>
            </div>
        );
    };

    for (let i = week; i <= lastWeek; i++) {
        result = result.concat(
            <div className="weekArea" key={i}>
                {Array(7)
                    .fill(0)
                    .map((data, index) => {
                        const days = today
                            .clone()
                            .startOf("year")
                            .week(i)
                            .startOf("week")
                            .add(index, "day");

                        if (
                            moment(todayDate).month() !==
                                moment(days).month() &&
                            index === 0 &&
                            week === firstWeek
                        ) {
                            return returnResult(
                                days,
                                index,
                                days.format("M/D")
                            );
                        } else if (
                            moment(todayDate).month() !==
                                moment(days).month() &&
                            moment(days).date() === 1
                        ) {
                            return returnResult(
                                days,
                                index,
                                days.format("M/D")
                            );
                        } else {
                            return returnResult(days, index, days.format("D"));
                        }
                    })}
            </div>
        );
    }
    return result;
};

export default RenderCalender;
