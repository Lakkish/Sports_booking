import { Modal, Button } from "react-bootstrap";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaQuestionCircle,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";

export default function ConfirmModal({
  show,
  onHide,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  size = "md",
  centered = true,
  backdrop = "static",
  keyboard = true,
  isLoading = false,
  confirmButtonProps = {},
  cancelButtonProps = {},
}) {
  const getIcon = () => {
    const iconSize = 48;

    switch (variant) {
      case "danger":
        return (
          <FaExclamationTriangle size={iconSize} className="text-danger" />
        );
      case "success":
        return <FaCheckCircle size={iconSize} className="text-success" />;
      case "info":
        return <FaQuestionCircle size={iconSize} className="text-info" />;
      case "warning":
      default:
        return <FaExclamationCircle size={iconSize} className="text-warning" />;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case "danger":
        return "danger";
      case "success":
        return "success";
      case "info":
        return "info";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-4">{getIcon()}</div>
        <h5>{title}</h5>
        <p className="text-muted">{message}</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="outline-secondary"
          onClick={onHide}
          disabled={isLoading}
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        <Button
          variant={getConfirmVariant()}
          onClick={handleConfirm}
          disabled={isLoading}
          {...confirmButtonProps}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Pre-configured confirm modals
export const DeleteConfirmModal = ({ resourceName = "item", ...props }) => (
  <ConfirmModal
    variant="danger"
    title={`Delete ${resourceName}`}
    message={`Are you sure you want to delete this ${resourceName}? This action cannot be undone.`}
    confirmText="Delete"
    confirmButtonProps={{
      startIcon: <FaTrash className="me-2" />,
    }}
    {...props}
  />
);

export const CancelConfirmModal = ({ resourceName = "booking", ...props }) => (
  <ConfirmModal
    variant="warning"
    title={`Cancel ${resourceName}`}
    message={`Are you sure you want to cancel this ${resourceName}? This action may be subject to cancellation fees.`}
    confirmText="Cancel Booking"
    {...props}
  />
);

export const LogoutConfirmModal = (props) => (
  <ConfirmModal
    variant="warning"
    title="Logout"
    message="Are you sure you want to logout? Any unsaved changes will be lost."
    confirmText="Logout"
    {...props}
  />
);

export const SuccessConfirmModal = ({
  message = "Action completed successfully!",
  ...props
}) => (
  <ConfirmModal
    variant="success"
    title="Success"
    message={message}
    confirmText="OK"
    cancelText={null}
    {...props}
  />
);
