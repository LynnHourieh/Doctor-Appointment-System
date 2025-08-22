import React, { useEffect, useRef } from "react";
import "./modal-styles.scss";
import type { ButtonProps, ModalProps } from "../../models/components";
import Button from "../button/Button";




const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, modalActions, }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
    // Only close if the user clicks directly on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  }}>
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          {children}

        </div>
        {!!modalActions?.length && (
          <div className="modal-actionsWrapper">
            {modalActions.map((buttonProps: ButtonProps) => (
              <Button {...buttonProps} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Modal;
