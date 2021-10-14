import { useContext } from "react";
import moment from "moment";

import { Modal } from "antd";
import NoticeContext from "../contexts/NoticeContext";
import "./NoticeModal.scss";

const NoticeModal = () => {
    const noticeContext = useContext(NoticeContext);

    const closeModal = () => {
        noticeContext.actions.setIsModalOpen(false);
    };

    const openModal = () => {
        noticeContext.actions.setIsModalOpen(true);
    };

    const { isModalOpen, modalData } = noticeContext.state;

    return (
        <Modal
            visible={isModalOpen}
            onCancel={closeModal}
            onOk={openModal}
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
                    src={modalData.image}
                    alt="공고이미지"
                />
                <p className="noticeName">{modalData.name}</p>
                <p className="noticeTime">
                    {moment(modalData.start_time).format("YYYY.MM.DD HH:mm")}~
                    {moment(modalData.end_time).format("YYYY.MM.DD HH:mm")}
                    <span className="oragneText">
                        (
                        {moment().diff(moment(modalData.end_time), "days") > 0
                            ? `${moment().diff(
                                  moment(modalData.end_time),
                                  "days"
                              )}일 지남`
                            : `${moment().diff(
                                  moment(modalData.end_time),
                                  "days"
                              )}일 전`}
                        )
                    </span>
                </p>
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: modalData.content,
                }}
            ></div>
        </Modal>
    );
};

export default NoticeModal;
