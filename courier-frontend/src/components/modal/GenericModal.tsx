import { ModalProps } from "../../types";


export const GenericModal = ({ title, body, show, onClose }: ModalProps) => {

    const displayClass = show ? 'd-block' : 'd-none';

    const handleClose = () => {
        onClose();
    }

    return(
        <>
            <div id="genericModal"
                className={`modal ${displayClass} show`}
                tabIndex={-1} >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                {body}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Cerrar</button>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
}