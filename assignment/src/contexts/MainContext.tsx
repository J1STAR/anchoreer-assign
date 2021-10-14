import axios from "axios";
import moment from "moment";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { Notice } from "../types/Notice";

type MainState = {
    todayDate: moment.Moment;
    data: Notice[];
};

type MainAction = {
    setTodayDate: Dispatch<SetStateAction<moment.Moment>>;
};

type MainContextType = {
    state: MainState;
    actions: MainAction;
};

const initialState = {
    state: {
        todayDate: moment(),
        data: [],
    },
    actions: {
        setTodayDate: () => {},
    },
};

const MainContext = createContext<MainContextType>(initialState);

const MainContextProvider = ({ children }: any) => {
    const [todayDate, setTodayDate] = useState(moment());
    const [data, setData] = useState([]);

    useEffect(() => {
        fecthData();
    }, []);

    const fecthData: () => void = async () => {
        try {
            const response: any = await axios.get(
                "https://frontend-assignments.s3.ap-northeast-2.amazonaws.com/job_postings.json"
            );
            console.log(response);
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const value = {
        state: {
            todayDate,
            data,
        },
        actions: {
            setTodayDate,
        },
    };

    return (
        <MainContext.Provider value={value}>{children}</MainContext.Provider>
    );
};

const NoticeConsumer = MainContext.Consumer;

export { MainContextProvider, NoticeConsumer };

export default MainContext;
