import React, { useEffect, useState } from "react";

import './style.css';

const ErrorNotification = ({ message, onClose }) => {
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2a10 10 0 0 0-9.95 9h2.01a8.002 8.002 0 0 1 15.89 0h2A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm1-10h-2v4h2v-4z"/>
            </svg>
        </div>
        <p>{message}</p>
        <button onClick={onClose}>X</button>
        </div>
    );
};

export default ErrorNotification;
