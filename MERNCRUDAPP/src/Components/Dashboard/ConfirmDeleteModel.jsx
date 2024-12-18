import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import './Dashboard.css';

const ConfirmDeleteModel = ({ show, handleClose, handleDelete, VehicleName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <span className='usernamedelete'>{VehicleName}?</span></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModel
