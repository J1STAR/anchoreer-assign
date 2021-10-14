import { useContext } from "react";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import "./DateHeader.scss";
import MainContext from "../contexts/MainContext";

const DateHeader = (props: any) => {
    const mainContext = useContext(MainContext);

    const { todayDate } = mainContext.state;
    const { setTodayDate } = mainContext.actions;

    const nextMonthClick = () => {
        props.filterAppendNotice();
        setTodayDate(todayDate.clone().add(1, "month"));
    };

    const prevMonthClick = () => {
        props.filterAppendNotice();
        setTodayDate(todayDate.clone().subtract(1, "month"));
    };

    return (
        <div className="dateHeader">
            <LeftOutlined onClick={prevMonthClick} />
            <span className="dateHeader_month">
                {todayDate.format("YYYY.M")}
            </span>
            <RightOutlined onClick={nextMonthClick} />
        </div>
    );
};

export default DateHeader;
