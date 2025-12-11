import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function AlertMessage({
  variant = "info",
  message,
  title,
  dismissible = true,
  showIcon = true,
  autoClose = false,
  autoCloseDelay = 5000,
  className = "",
  onClose,
  children,
}) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  // Auto-close functionality
  useState(() => {
    if (autoClose && show) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, show]);

  if (!show) return null;

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <FaCheckCircle className="me-2" />;
      case "warning":
        return <FaExclamationTriangle className="me-2" />;
      case "danger":
        return <FaExclamationCircle className="me-2" />;
      case "info":
      default:
        return <FaInfoCircle className="me-2" />;
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "alert-success border-success";
      case "warning":
        return "alert-warning border-warning";
      case "danger":
        return "alert-danger border-danger";
      case "info":
      default:
        return "alert-info border-info";
    }
  };

  return (
    <Alert
      variant={variant}
      dismissible={dismissible}
      onClose={handleClose}
      className={`${getVariantClass()} ${className} shadow-sm`}
    >
      <div className="d-flex align-items-start">
        {showIcon && getIcon()}
        <div className="flex-grow-1">
          {title && <Alert.Heading className="h5 mb-2">{title}</Alert.Heading>}
          <div className="mb-0">
            {message}
            {children}
          </div>
        </div>
        {dismissible && (
          <Button
            variant="link"
            className="p-0 ms-2 text-dark"
            onClick={handleClose}
            aria-label="Close"
          >
            <FaTimes />
          </Button>
        )}
      </div>
    </Alert>
  );
}

// Pre-configured alert components
export const SuccessAlert = (props) => (
  <AlertMessage variant="success" showIcon {...props} />
);

export const WarningAlert = (props) => (
  <AlertMessage variant="warning" showIcon {...props} />
);

export const DangerAlert = (props) => (
  <AlertMessage variant="danger" showIcon {...props} />
);

export const InfoAlert = (props) => (
  <AlertMessage variant="info" showIcon {...props} />
);

// Toast-style alert (fixed position)
export const ToastAlert = ({
  variant = "info",
  message,
  title,
  position = "top-end",
}) => {
  const positionClasses = {
    "top-start": "top-0 start-0",
    "top-center": "top-0 start-50 translate-middle-x",
    "top-end": "top-0 end-0",
    "bottom-start": "bottom-0 start-0",
    "bottom-center": "bottom-0 start-50 translate-middle-x",
    "bottom-end": "bottom-0 end-0",
  };

  return (
    <div
      className={`position-fixed ${positionClasses[position]} m-3`}
      style={{ zIndex: 9999 }}
    >
      <AlertMessage
        variant={variant}
        message={message}
        title={title}
        dismissible
        autoClose
        className="shadow-lg"
      />
    </div>
  );
};
