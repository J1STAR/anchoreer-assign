import { useContext, useEffect } from "react";
import moment from "moment";

import { Notice } from "../types/Notice";
import NoticeModal from "../component/NoticeModal";
import NoticeContext from "../contexts/NoticeContext";
import WeekName from "../component/WeekName";
import MainContext from "../contexts/MainContext";
import DateHeader from "../component/DateHeader";
import RenderCalender from "../component/RenderCalender";

const CalendarPage = () => {
    const mainContext = useContext(MainContext);
    const noticeContext = useContext(NoticeContext);

    const { todayDate, data } = mainContext.state;

    useEffect(() => {
        filterAppendNotice();
    });

    const clearChild = () => {
        const displayNoticeArea =
            document.querySelectorAll(".displayNoticeArea");
        for (let i = 0; i <= displayNoticeArea.length; i++) {
            while (displayNoticeArea[i]?.hasChildNodes()) {
                displayNoticeArea[i].removeChild(
                    displayNoticeArea[i].firstChild as Node
                );
            }
        }
    };

    const appendStartNotice = (curNotice: Notice[]) => {
        curNotice
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .forEach((notice: Notice) => {
                const startDateSpan = document.querySelector(
                    `.date${moment(notice.start_time).format("MMDD")}`
                );

                const startContent = document.createElement("p");
                startContent.innerHTML = `<div class="noticeName"><span class="startText">시</span> ${notice.name}</div>`;
                startContent.addEventListener("click", () =>
                    onClickNotice(notice)
                );

                startDateSpan?.append(startContent);
            });
    };

    const appendEndNotice = (curNotice: Notice[]) => {
        curNotice
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .forEach((notice: Notice) => {
                const endDateSpan = document.querySelector(
                    `.date${moment(notice.end_time).format("MMDD")}`
                );

                const endContent = document.createElement("p");
                endContent.innerHTML = `<div class="noticeName"><span class="endText">끝</span> ${notice.name}</div>`;
                endContent.addEventListener("click", () =>
                    onClickNotice(notice)
                );

                endDateSpan?.append(endContent);
            });
    };

    const onClickNotice = (notice: Notice) => {
        noticeContext.actions.setIsModalOpen(true);
        noticeContext.actions.setModalData(notice);
    };

    const filterAppendNotice: () => void = () => {
        const curNotice = data.filter((notice: Notice) => {
            if (
                moment(notice.start_time).month() + 1 ===
                    moment(todayDate).month() + 1 ||
                moment(notice.start_time).month() + 1 ===
                    moment(todayDate).month() ||
                moment(notice.start_time).month() + 1 ===
                    moment(todayDate).month() + 2
            ) {
                return notice;
            }
            return null;
        });
        clearChild();
        appendStartNotice(curNotice);
        appendEndNotice(curNotice);
    };

    return (
        <>
            <DateHeader filterAppendNotice={filterAppendNotice} />
            <WeekName />
            <RenderCalender />
            <NoticeModal />
        </>
    );
};

export default CalendarPage;
