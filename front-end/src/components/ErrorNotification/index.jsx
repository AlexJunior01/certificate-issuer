import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import './style.css';

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
        onClose();
        }, 5000);

        return () => {
        clearTimeout(timeout);
        };
    }, [onClose]);

    return (
        <div className="notification">
        <div className="notification-icon">
            <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <p>{message}</p>
        <button onClick={onClose} className="close-button">
            &times;
        </button>
        </div>
    );
};

export default Notification;
