import React, { useEffect, useRef } from "react";
import { ModalProps } from "../../types";
import { Modal } from "bootstrap";


export const GenericModal: React.FC<ModalProps> = ({ title, body, show, onClose }) => {

    const modalRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        onClose();
    }

    useEffect(() => {
        if(modalRef.current){
            const modal = new Modal(modalRef.current);
            show ? modal.show() : modal.hide();
        }
        
    }, [show]);

    return(
        <>
            <div id="genericModal"
                className={`modal ${show ? 'show' : ''}`}
                tabIndex={-1}
                style={{ display: show ? 'block' : 'none' }}
                ref={modalRef}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                {body()}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
}