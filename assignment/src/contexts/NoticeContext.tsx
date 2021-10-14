import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Notice } from "../types/Notice";

type NoticeState = {
    isModalOpen: boolean;
    modalData: Notice;
};

type NoticeAction = {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    setModalData: Dispatch<SetStateAction<Notice>>;
};

type NoticeContextType = {
    state: NoticeState;
    actions: NoticeAction;
};

const initialState = {
    state: {
        isModalOpen: false,
        modalData: {
            id: 0,
            content: "",
            start_time: "",
            end_time: "",
            name: "",
            image: "",
        },
    },
    actions: {
        setIsModalOpen: () => {},
        setModalData: () => {},
    },
};

const NoticeContext = createContext<NoticeContextType>(initialState);

const NoticeContextProvider = ({ children }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        id: 0,
        content: "",
        start_time: "",
        end_time: "",
        name: "",
        image: "",
    });

    const value = {
        state: {
            isModalOpen,
            modalData,
        },
        actions: {
            setIsModalOpen,
            setModalData,
        },
    };

    return (
        <NoticeContext.Provider value={value}>
            {children}
        </NoticeContext.Provider>
    );
};

const NoticeConsumer = NoticeContext.Consumer;

export { NoticeContextProvider, NoticeConsumer };

export default NoticeContext;
