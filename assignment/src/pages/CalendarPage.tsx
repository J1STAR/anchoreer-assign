import React from "react";
import axios from "axios";
import moment from "moment";

import Modal from "react-modal";

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
            todayDate: moment("20210601"),
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
                    6
                    // moment(this.state.todayDate).month() + 1
                ) {
                    return notice;
                }
            });

            // this.calendarArr(curNotice);
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
        curNotice.map((notice: Notice) => {
            const startDateSpan = document.querySelector(
                `.date${moment(notice.start_time).format("MMDD")}`
            );

            const startContent = document.createElement("p");
            startContent.innerHTML = `<div>시 ${notice.name}</div>`;
            startContent.addEventListener("click", () =>
                this.onClickNotice(notice)
            );

            startDateSpan?.append(startContent);
        });
    };

    appendEndNotice = (curNotice: Notice[]) => {
        curNotice.map((notice: Notice) => {
            const endDateSpan = document.querySelector(
                `.date${moment(notice.end_time).format("MMDD")}`
            );

            const endContent = document.createElement("p");
            endContent.innerHTML = `<div>끝 ${notice.name}</div>`;
            endContent.addEventListener("click", () =>
                this.onClickNotice(notice)
            );

            endDateSpan?.append(endContent);
        });
    };

    onClickNotice = (notice: Notice) => {
        console.log("clickNotice", notice);
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

                            return (
                                <div className="dateArea" key={index}>
                                    <p className="date">{days.format("D")}</p>
                                    <p
                                        className={`date${days.format("MMDD")}`}
                                    ></p>
                                </div>
                            );
                        })}
                </div>
            );
        }
        return result;
    };

    // calendarArr = (noticeArr: []) => {
    //     const today = this.state.todayDate;
    //     let firstWeek = today.clone().startOf("month").week();
    //     const lastWeek =
    //         today.clone().endOf("month").week() === 1
    //             ? 53
    //             : today.clone().endOf("month").week();

    //     let tempArr = [] as any;

    //     for (firstWeek; firstWeek <= lastWeek; firstWeek++) {
    //         for (let i = 1; i <= 7; i++) {
    //             let days = today
    //                 .clone()
    //                 .startOf("year")
    //                 .week(firstWeek)
    //                 .startOf("week")
    //                 .add(i, "day");
    //             tempArr.push({
    //                 date: days.format("D"),
    //             });
    //         }
    //     }
    //     noticeArr.map((notice: Notice) => {
    //         tempArr.map((res: any) => {
    //             if (moment(notice.start_time).format("D") === res.date) {
    //                 console.log(res.notice);
    //                 res.notice = notice;
    //             }
    //         });
    //     });

    //     this.setState({
    //         dateArr: tempArr,
    //     });
    // };

    // renderCalendar = () => {
    //     let renderResult: any = [];
    //     for (let i = 1; i < 7; i++) {
    //         renderResult.push(`<div class="weekArea">`);

    //         this.state.dateArr
    //             .slice((i - 1) * 7, i * 7)
    //             .map((dateInfo: DateArr) => {
    //                 renderResult.push(
    //                     `<div class="dateArea">
    //                         <p class="date">${dateInfo.date}</p>
    //                         <p class="noticeName">${
    //                             dateInfo.notice ? dateInfo.notice.name : ""
    //                         }</p>
    //                     </div>`
    //                 );
    //             });
    //         renderResult.push(`</div>`);
    //     }
    //     return (
    //         <div
    //             dangerouslySetInnerHTML={{ __html: renderResult.join("") }}
    //         ></div>
    //     );
    // };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        });
    };

    render() {
        return (
            <>
                <div className="monthHeader">
                    <button
                        onClick={() =>
                            this.setState({
                                todayDate: this.state.todayDate
                                    .clone()
                                    .subtract(1, "month"),
                            })
                        }
                    >
                        이전달
                    </button>
                    {this.state.todayDate.format("YYYY.MM")}
                    <button
                        onClick={() =>
                            this.setState({
                                todayDate: this.state.todayDate
                                    .clone()
                                    .add(1, "month"),
                            })
                        }
                    >
                        다음달
                    </button>
                </div>
                <div>{this.calendarArr()}</div>

                <Modal
                    isOpen={this.state.isModalOpen}
                    ariaHideApp={false}
                    onRequestClose={this.closeModal}
                    className="noticeModal"
                >
                    <div>
                        <img
                            className="noticeImage"
                            width="90px"
                            height="90px"
                            src={this.state.modalData.image}
                            alt="공고이미지"
                        />
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.modalData.content,
                        }}
                    ></div>
                </Modal>
            </>
            // <div>
            //     {this.state.data.map((notice: Notice) => (
            // <div
            //     key={notice.id}
            //     dangerouslySetInnerHTML={{ __html: notice.content }}
            // ></div>
            //     ))}
            // </div>
        );
    }
}

export default CalendarPage;
