import React from "react";
import Modal from 'react-bootstrap/Modal'
import {Button} from "react-bootstrap";

function Dialog(props) {
    return (
        <Modal
            {...props.modalProps}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {props.children}
            </Modal.Body>

            <Modal.Footer>
                {
                    props.buttons.map((button,i)=> <Button key={i} variant={button.variant} onClick={button.onClick}>{button.text}</Button>)
                }
            </Modal.Footer>
        </Modal>
    );
}

export default Dialog;