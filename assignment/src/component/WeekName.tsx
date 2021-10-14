import "./WeekName.scss";

const WeekName = () => {
    const weekArray = ["일", "월", "화", "수", "목", "금", "토"];
    return (
        <div className="weekNameArea">
            {weekArray.map((week: string, idx: number) => (
                <div key={idx} className="weekName">
                    {week}
                </div>
            ))}
        </div>
    );
};

export default WeekName;
