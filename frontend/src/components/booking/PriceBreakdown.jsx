import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Alert,
  Spinner,
  Badge,
  Button,
  Accordion,
} from "react-bootstrap";
import {
  FaRupeeSign,
  FaCalculator,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaReceipt,
} from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import * as bookingService from "../../services/bookingService";
import { formatPrice, calculateHours } from "../../utils/dateUtils";

export default function PriceBreakdown({
  court,
  equipment = [],
  coach,
  selectedTime = {},
  showDetails = true,
  onPriceCalculated,
}) {
  const { post, isLoading, error } = useApi();
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);

  // Calculate price whenever dependencies change
  useEffect(() => {
    const calculatePrice = async () => {
      if (!court || !selectedTime.start || !selectedTime.end) {
        setPriceBreakdown(null);
        return;
      }

      try {
        const payload = {
          court: court._id,
          coach: coach?._id || null,
          equipment: equipment.map((e) => ({
            equipmentId: e.equipmentId,
            quantity: e.quantity,
          })),
          startTime: selectedTime.start,
          endTime: selectedTime.end,
        };

        const data = await post(bookingService.calculatePrice, payload);
        setPriceBreakdown(data);

        // Notify parent component
        if (onPriceCalculated) {
          onPriceCalculated(data);
        }
      } catch (err) {
        setPriceBreakdown(null);
      }
    };

    calculatePrice();
  }, [court, equipment, coach, selectedTime]);

  // Get total hours
  const totalHours =
    selectedTime.start && selectedTime.end
      ? calculateHours(selectedTime.start, selectedTime.end)
      : 0;

  // Render loading state
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 mb-0">Calculating price...</p>
        </Card.Body>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="danger">
        <FaInfoCircle className="me-2" />
        Unable to calculate price. Please try again.
      </Alert>
    );
  }

  // Render empty state
  if (!priceBreakdown || !court) {
    return (
      <Card className="shadow-sm">
        <Card.Body>
          <div className="text-center py-4">
            <FaCalculator size={48} className="text-muted mb-3" />
            <h5>Price Breakdown</h5>
            <p className="text-muted">
              Select a court and time slot to see pricing details.
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  // Calculate totals for summary
  const subtotal =
    priceBreakdown.basePrice +
    priceBreakdown.indoorPremium +
    priceBreakdown.peakFee +
    priceBreakdown.weekendFee;

  const extrasTotal = priceBreakdown.equipmentFee + priceBreakdown.coachFee;

  const taxAmount = priceBreakdown.tax || 0;
  const finalTotal = priceBreakdown.total;

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <FaReceipt className="me-2" />
            Price Breakdown
          </h5>
          <small>
            Total duration: {totalHours} hour{totalHours !== 1 ? "s" : ""}
          </small>
        </div>
        <Badge bg="light" text="dark" className="fs-5">
          <FaRupeeSign /> {formatPrice(finalTotal)}
        </Badge>
      </Card.Header>

      <Card.Body>
        {/* Summary Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Booking Summary</h6>
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShowFullBreakdown(!showFullBreakdown)}
            >
              {showFullBreakdown ? (
                <>
                  Hide Details <FaChevronUp className="ms-1" />
                </>
              ) : (
                <>
                  Show Details <FaChevronDown className="ms-1" />
                </>
              )}
            </Button>
          </div>

          {/* Court Details */}
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <span>
                <strong>{court.name}</strong>
                <Badge
                  bg={court.type === "indoor" ? "info" : "success"}
                  className="ms-2"
                >
                  {court.type}
                </Badge>
              </span>
              <span className="text-success fw-bold">
                <FaRupeeSign /> {formatPrice(priceBreakdown.basePrice)}
              </span>
            </div>
            <small className="text-muted">
              {totalHours} hour{totalHours !== 1 ? "s" : ""} @{" "}
              {formatPrice(court.basePrice)}/hour
            </small>
          </div>

          {/* Extras Summary */}
          {extrasTotal > 0 && (
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Extras:</span>
                <span className="text-success fw-bold">
                  <FaRupeeSign /> {formatPrice(extrasTotal)}
                </span>
              </div>
              {coach && (
                <small className="d-block text-muted">
                  • Coach: {coach.name} ({formatPrice(priceBreakdown.coachFee)})
                </small>
              )}
              {equipment.length > 0 && (
                <small className="d-block text-muted">
                  • Equipment: {equipment.length} item
                  {equipment.length !== 1 ? "s" : ""} (
                  {formatPrice(priceBreakdown.equipmentFee)})
                </small>
              )}
            </div>
          )}

          {/* Additional Charges Summary */}
          {(priceBreakdown.indoorPremium > 0 ||
            priceBreakdown.peakFee > 0 ||
            priceBreakdown.weekendFee > 0) && (
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Additional Charges:</span>
                <span className="text-warning fw-bold">
                  <FaRupeeSign />{" "}
                  {formatPrice(
                    priceBreakdown.indoorPremium +
                      priceBreakdown.peakFee +
                      priceBreakdown.weekendFee
                  )}
                </span>
              </div>
              {priceBreakdown.indoorPremium > 0 && (
                <small className="d-block text-muted">• Indoor Premium</small>
              )}
              {priceBreakdown.peakFee > 0 && (
                <small className="d-block text-muted">• Peak Hours Fee</small>
              )}
              {priceBreakdown.weekendFee > 0 && (
                <small className="d-block text-muted">• Weekend Fee</small>
              )}
            </div>
          )}
        </div>

        {/* Detailed Breakdown (Collapsible) */}
        {showFullBreakdown && (
          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <FaCalculator className="me-2" />
                Detailed Cost Breakdown
              </Accordion.Header>
              <Accordion.Body>
                <Table borderless size="sm" className="mb-0">
                  <tbody>
                    {/* Base Court Cost */}
                    <tr>
                      <td>
                        <div>Court Booking ({court.name})</div>
                        <small className="text-muted">
                          {totalHours} hour{totalHours !== 1 ? "s" : ""} ×{" "}
                          {formatPrice(court.basePrice)}/hour
                        </small>
                      </td>
                      <td className="text-end">
                        <FaRupeeSign /> {formatPrice(priceBreakdown.basePrice)}
                      </td>
                    </tr>

                    {/* Indoor Premium */}
                    {priceBreakdown.indoorPremium > 0 && (
                      <tr>
                        <td>
                          <div>Indoor Court Premium</div>
                          <small className="text-muted">
                            Additional charge for indoor facilities
                          </small>
                        </td>
                        <td className="text-end text-warning">
                          + <FaRupeeSign />{" "}
                          {formatPrice(priceBreakdown.indoorPremium)}
                        </td>
                      </tr>
                    )}

                    {/* Peak Fee */}
                    {priceBreakdown.peakFee > 0 && (
                      <tr>
                        <td>
                          <div>Peak Hours Surcharge</div>
                          <small className="text-muted">
                            {selectedTime.start &&
                            new Date(selectedTime.start).getHours() >= 18
                              ? "Evening (6PM-9PM)"
                              : "Peak time"}
                          </small>
                        </td>
                        <td className="text-end text-warning">
                          + <FaRupeeSign />{" "}
                          {formatPrice(priceBreakdown.peakFee)}
                        </td>
                      </tr>
                    )}

                    {/* Weekend Fee */}
                    {priceBreakdown.weekendFee > 0 && (
                      <tr>
                        <td>
                          <div>Weekend Surcharge</div>
                          <small className="text-muted">
                            Weekend booking premium
                          </small>
                        </td>
                        <td className="text-end text-warning">
                          + <FaRupeeSign />{" "}
                          {formatPrice(priceBreakdown.weekendFee)}
                        </td>
                      </tr>
                    )}

                    {/* Coach Fee */}
                    {priceBreakdown.coachFee > 0 && coach && (
                      <tr>
                        <td>
                          <div>Coach: {coach.name}</div>
                          <small className="text-muted">
                            {totalHours} hour{totalHours !== 1 ? "s" : ""} ×{" "}
                            {formatPrice(coach.pricePerHour)}/hour
                          </small>
                        </td>
                        <td className="text-end text-info">
                          + <FaRupeeSign />{" "}
                          {formatPrice(priceBreakdown.coachFee)}
                        </td>
                      </tr>
                    )}

                    {/* Equipment Fee */}
                    {priceBreakdown.equipmentFee > 0 &&
                      equipment.length > 0 && (
                        <tr>
                          <td>
                            <div>Equipment Rental</div>
                            <small className="text-muted">
                              {equipment.length} item
                              {equipment.length !== 1 ? "s" : ""}
                            </small>
                          </td>
                          <td className="text-end text-info">
                            + <FaRupeeSign />{" "}
                            {formatPrice(priceBreakdown.equipmentFee)}
                          </td>
                        </tr>
                      )}

                    {/* Subtotal */}
                    <tr className="border-top">
                      <td className="fw-bold">Subtotal</td>
                      <td className="text-end fw-bold">
                        <FaRupeeSign /> {formatPrice(subtotal + extrasTotal)}
                      </td>
                    </tr>

                    {/* Tax */}
                    {taxAmount > 0 && (
                      <tr>
                        <td>
                          <div>Tax ({priceBreakdown.taxRate || 18}%)</div>
                          <small className="text-muted">GST applicable</small>
                        </td>
                        <td className="text-end text-muted">
                          + <FaRupeeSign /> {formatPrice(taxAmount)}
                        </td>
                      </tr>
                    )}

                    {/* Final Total */}
                    <tr className="border-top border-2">
                      <td className="h5">Total Amount</td>
                      <td className="text-end h5 text-success">
                        <FaRupeeSign /> {formatPrice(finalTotal)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* Payment Note */}
        <Alert variant="light" className="small mb-0">
          <FaInfoCircle className="me-2" />
          <strong>Note:</strong> Payment is required at the time of booking.
          Cancellations made 24 hours before the booking time will receive a
          full refund.
        </Alert>
      </Card.Body>
    </Card>
  );
}
