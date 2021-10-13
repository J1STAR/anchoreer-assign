import React from "react";
import axios from "axios";
import moment from "moment";
import "./CalendarPage.scss";

type Notice = {
    id: number;
    content: string;
    start_time: string;
    end_time: string;
    name: string;
    image: string;
};

type Props = {};

type State = {
    data: Notice[];
    todayDate: moment.Moment;
};

class CalendarPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: [],
            todayDate: moment(),
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

            this.calendarArr(curNotice);
            this.setState({
                data: response.data as Notice[],
            });
        } catch (err) {
            console.error(err);
        }
    };

    calendarArr = (noticeArr: []) => {
        const today = this.state.todayDate;
        let firstWeek = today.clone().startOf("month").week();
        const lastWeek =
            today.clone().endOf("month").week() === 1
                ? 53
                : today.clone().endOf("month").week();

        let result = [] as any;

        console.log(firstWeek, lastWeek);

        for (firstWeek; firstWeek <= lastWeek; firstWeek++) {
            for (let i = 1; i <= 7; i++) {
                let days = today
                    .clone()
                    .startOf("year")
                    .week(firstWeek)
                    .startOf("week")
                    .add(i, "day");
                console.log(days.format("D"));
                result.push({
                    date: days.format("D"),
                });
            }
        }
        console.log(result, noticeArr);
        noticeArr.map((notice: Notice) => {
            result.map((res: any) => {
                if (moment(notice.start_time).format("D") === res.date) {
                    res.notice = notice;
                }
            });
        });

        console.log(result);

        // for (week; week <= lastWeek; week++) {
        //     result = result.concat(
        //         <div className="weekArea" key={week}>
        //             {Array(7)
        //                 .fill(0)
        //                 .map((data, index) => {
        //                     let days = today
        //                         .clone()
        //                         .startOf("year")
        //                         .week(week)
        //                         .startOf("week")
        //                         .add(index, "day");

        //                     return (
        //                         <div className="dateArea" key={index}>
        //                             <span>{days.format("D")}</span>
        //                         </div>
        //                     );
        //                 })}
        //         </div>
        //     );
        // }
        return result;
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
                {/* <div>{this.calendarArr()}</div> */}
            </>
            // <div>
            //     {this.state.data.map((notice: Notice) => (
            //         <div
            //             key={notice.id}
            //             dangerouslySetInnerHTML={{ __html: notice.content }}
            //         ></div>
            //     ))}
            // </div>
        );
    }
}

export default CalendarPage;
