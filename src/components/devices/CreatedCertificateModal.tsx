import React from "react";
import ReactModal from "react-modal";
import CloseModalIcon from "../icons/CloseModalIcon";
import DangerIcon from "../icons/DangerIcon";
import { Certificate } from "../../API";

type Props = {
  show: boolean;
  certificate: Certificate | null;
  onClose: () => void;
};

const DeleteCertificateModal: React.FC<Props> = ({
  show,
  certificate,
  onClose,
}) => {
  const modalStyle = {
    overlay: {
      zIndex: 40,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: 50,
    },
  };

  return (
    <ReactModal isOpen={show} style={modalStyle} ariaHideApp={false}>
      <div className="flex justify-end p-2">
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          onClick={() => onClose()}
        >
          <CloseModalIcon />
        </button>
      </div>
      <div className="p-6 pt-0 text-center">
        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
          作成した証明書をダウンロードしてください。
        </h3>
      </div>
    </ReactModal>
  );
};

export default DeleteCertificateModal;