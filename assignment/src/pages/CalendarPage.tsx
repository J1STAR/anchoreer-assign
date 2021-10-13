import React from "react";
import axios from "axios";
import moment from "moment";

import { Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import "./CalendarPage.scss";

type Notice = {
    id: number;
    content: string;
    start_time: string;
    end_time: string;
    name: string;
    image: string;
};

type DateArr = {
    date: string;
    notice: Notice;
};

type Props = {};

type State = {
    data: Notice[];
    todayDate: moment.Moment;
    dateArr: DateArr[];
    isModalOpen: boolean;
    modalData: Notice;
};

class CalendarPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            todayDate: moment(),
            dateArr: [],
            isModalOpen: false,
            modalData: {
                id: 0,
                content: "",
                start_time: "",
                end_time: "",
                name: "",
                image: "",
            },
        };
    }

    componentDidMount() {
        this.fecthData();
    }

    fecthData = async () => {
        try {
            const response: any = await axios.get(
                "https://frontend-assignments.s3.ap-northeast-2.amazonaws.com/job_postings.json"
            );
            const curNotice = response.data.filter((notice: Notice) => {
                if (
                    moment(notice.start_time).month() + 1 ===
                        moment(this.state.todayDate).month() + 1 ||
                    moment(notice.start_time).month() + 1 ===
                        moment(this.state.todayDate).month() ||
                    moment(notice.start_time).month() + 1 ===
                        moment(this.state.todayDate).month() + 2
                ) {
                    return notice;
                }
            });
            console.log(curNotice);

            const displayNoticeArea =
                document.querySelectorAll(".displayNoticeArea");
            for (let i = 0; i <= displayNoticeArea.length; i++) {
                while (displayNoticeArea[i]?.hasChildNodes()) {
                    displayNoticeArea[i].removeChild(
                        displayNoticeArea[i].firstChild as any
                    );
                }
            }

            this.appendStartNotice(curNotice);
            this.appendEndNotice(curNotice);
            this.setState({
                data: response.data as Notice[],
            });
        } catch (err) {
            console.error(err);
        }
    };

    appendStartNotice = (curNotice: Notice[]) => {
        curNotice
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((notice: Notice) => {
                const startDateSpan = document.querySelector(
                    `.date${moment(notice.start_time).format("MMDD")}`
                );

                const startContent = document.createElement("p");
                startContent.innerHTML = `<div class="noticeName"><span class="startText">시</span> ${notice.name}</div>`;
                startContent.addEventListener("click", () =>
                    this.onClickNotice(notice)
                );

                startDateSpan?.append(startContent);
            });
    };

    appendEndNotice = (curNotice: Notice[]) => {
        curNotice
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((notice: Notice) => {
                const endDateSpan = document.querySelector(
                    `.date${moment(notice.end_time).format("MMDD")}`
                );

                const endContent = document.createElement("p");
                endContent.innerHTML = `<div class="noticeName"><span class="endText">끝</span> ${notice.name}</div>`;
                endContent.addEventListener("click", () =>
                    this.onClickNotice(notice)
                );

                endDateSpan?.append(endContent);
            });
    };

    onClickNotice = (notice: Notice) => {
        this.setState({
            isModalOpen: true,
            modalData: notice,
        });
    };
    calendarArr = () => {
        const today = this.state.todayDate;
        const firstWeek = today.clone().startOf("month").week();
        const lastWeek =
            today.clone().endOf("month").week() === 1
                ? 53
                : today.clone().endOf("month").week();

        let result: any = [];
        let week = firstWeek;
        for (week; week <= lastWeek; week++) {
            result = result.concat(
                <div className="weekArea" key={week}>
                    {Array(7)
                        .fill(0)
                        .map((data, index) => {
                            let days = today
                                .clone()
                                .startOf("year")
                                .week(week)
                                .startOf("week")
                                .add(index, "day");
                            if (
                                moment(this.state.todayDate).month() !==
                                    moment(days).month() &&
                                index === 0 &&
                                week === firstWeek
                            ) {
                                return (
                                    <div className="dateArea" key={index}>
                                        <p className="date">
                                            {days.format("MM/DD")}
                                        </p>
                                        <p
                                            className={`displayNoticeArea date${days.format(
                                                "MMDD"
                                            )}`}
                                        ></p>
                                    </div>
                                );
                            } else if (
                                moment(this.state.todayDate).month() !==
                                    moment(days).month() &&
                                moment(days).date() === 1
                            ) {
                                return (
                                    <div className="dateArea" key={index}>
                                        <p className="date">
                                            {days.format("MM/DD")}
                                        </p>
                                        <p
                                            className={`displayNoticeArea date${days.format(
                                                "MMDD"
                                            )}`}
                                        ></p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="dateArea" key={index}>
                                        <p className="date">
                                            {days.format("D")}
                                        </p>
                                        <p
                                            className={`displayNoticeArea date${days.format(
                                                "MMDD"
                                            )}`}
                                        ></p>
                                    </div>
                                );
                            }
                        })}
                </div>
            );
        }
        return result;
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        });
    };

    openModal = () => {
        this.setState({
            isModalOpen: true,
        });
    };

    nextMonthClick = () => {
        this.fecthData();
        this.setState({
            todayDate: this.state.todayDate.clone().add(1, "month"),
        });
    };

    prevMonthClick = () => {
        this.fecthData();
        this.setState({
            todayDate: this.state.todayDate.clone().subtract(1, "month"),
        });
    };

    render() {
        const weekArray = ["일", "월", "화", "수", "목", "금", "토"];
        return (
            <>
                <div className="monthHeader">
                    <LeftOutlined onClick={this.prevMonthClick} />
                    <span className="monthHeader_month">
                        {this.state.todayDate.format("YYYY.MM")}
                    </span>
                    <RightOutlined onClick={this.nextMonthClick} />
                </div>
                <div className="weekNameArea">
                    {weekArray.map((week: string, idx: number) => (
                        <div key={idx} className="weekName">
                            {week}
                        </div>
                    ))}
                </div>
                <div>{this.calendarArr()}</div>

                <Modal
                    visible={this.state.isModalOpen}
                    onCancel={this.closeModal}
                    onOk={this.openModal}
                    className="noticeModal"
                    centered
                    width="75%"
                    footer={null}
                >
                    <div className="modalHeaderArea">
                        <img
                            className="noticeImage"
                            width="90px"
                            height="90px"
                            src={this.state.modalData.image}
                            alt="공고이미지"
                        />
                        <p className="noticeName">
                            {this.state.modalData.name}
                        </p>
                        <p className="noticeTime">
                            {moment(this.state.modalData.start_time).format(
                                "YYYY.MM.DD HH:mm"
                            )}
                            ~
                            {moment(this.state.modalData.end_time).format(
                                "YYYY.MM.DD HH:mm"
                            )}
                            <span className="oragneText">
                                (
                                {moment().diff(
                                    moment(this.state.modalData.end_time),
                                    "days"
                                ) > 0
                                    ? `${moment().diff(
                                          moment(this.state.modalData.end_time),
                                          "days"
                                      )}일 지남`
                                    : `${moment().diff(
                                          moment(this.state.modalData.end_time),
                                          "days"
                                      )}일 전`}
                                )
                            </span>
                        </p>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.modalData.content,
                        }}
                    ></div>
                </Modal>
            </>
        );
    }
}

export default CalendarPage;
