import { Button } from "react-bootstrap";
import {
  FaSearch,
  FaCalendarPlus,
  FaBoxOpen,
  FaUserSlash,
  FaExclamationTriangle,
  FaSadTear,
  FaPlusCircle,
} from "react-icons/fa";

export default function EmptyState({
  icon = "search",
  title = "No items found",
  message = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  size = "md",
  className = "",
}) {
  const getIcon = () => {
    const iconProps = { size: size === "lg" ? 64 : size === "sm" ? 32 : 48 };

    switch (icon) {
      case "booking":
        return <FaCalendarPlus {...iconProps} />;
      case "equipment":
        return <FaBoxOpen {...iconProps} />;
      case "user":
        return <FaUserSlash {...iconProps} />;
      case "warning":
        return <FaExclamationTriangle {...iconProps} />;
      case "sad":
        return <FaSadTear {...iconProps} />;
      case "add":
        return <FaPlusCircle {...iconProps} />;
      case "search":
      default:
        return <FaSearch {...iconProps} />;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "py-3";
      case "lg":
        return "py-5";
      default:
        return "py-4";
    }
  };

  return (
    <div className={`text-center ${getSizeClass()} ${className}`}>
      <div className="text-muted mb-3">{getIcon()}</div>
      <h5 className="mb-2">{title}</h5>
      <p className="text-muted mb-4">{message}</p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="d-flex justify-content-center gap-2">
          {actionLabel && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline-secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured empty states
export const NoDataEmptyState = ({ resource = "data", onRefresh }) => (
  <EmptyState
    icon="search"
    title={`No ${resource} found`}
    message={`We couldn't find any ${resource} matching your criteria.`}
    actionLabel="Refresh"
    onAction={onRefresh}
  />
);

export const NoBookingsEmptyState = ({ onBookNow }) => (
  <EmptyState
    icon="booking"
    title="No Bookings Yet"
    message="You haven't made any bookings yet. Start by booking your first court!"
    actionLabel="Book Now"
    onAction={onBookNow}
  />
);

export const NoEquipmentEmptyState = ({ onAddEquipment }) => (
  <EmptyState
    icon="equipment"
    title="No Equipment Available"
    message="There is no equipment available for booking at the moment."
    actionLabel="Add Equipment"
    onAction={onAddEquipment}
    secondaryActionLabel="Refresh"
  />
);

export const NoSearchResultsEmptyState = ({ onClearSearch }) => (
  <EmptyState
    icon="search"
    title="No Results Found"
    message="Try adjusting your search or filter to find what you're looking for."
    actionLabel="Clear Search"
    onAction={onClearSearch}
  />
);

export const EmptyCartState = ({ onBrowse }) => (
  <EmptyState
    icon="sad"
    title="Your Cart is Empty"
    message="Add some equipment or select a coach to enhance your booking experience."
    actionLabel="Browse Equipment"
    onAction={onBrowse}
  />
);
