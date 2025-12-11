import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

/**
 * Custom hook for booking functionality
 * @returns {object} Booking context values and utility functions
 */
export const useBooking = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }

  const {
    selectedCourt,
    setSelectedCourt,
    selectedEquipment,
    setSelectedEquipment,
    selectedCoach,
    setSelectedCoach,
    selectedTime,
    setSelectedTime,
    priceBreakdown,
    setPriceBreakdown,
  } = context;

  /**
   * Reset all booking selections
   */
  const resetBooking = () => {
    setSelectedCourt(null);
    setSelectedEquipment([]);
    setSelectedCoach(null);
    setSelectedTime({});
    setPriceBreakdown({});
  };

  /**
   * Check if booking has all required fields
   * @returns {boolean}
   */
  const isBookingComplete = () => {
    return selectedCourt && selectedTime.start && selectedTime.end;
  };

  /**
   * Add equipment to selection
   * @param {object} equipment
   * @param {number} quantity
   */
  const addEquipment = (equipment, quantity = 1) => {
    const existingIndex = selectedEquipment.findIndex(
      (item) => item.equipmentId === equipment._id
    );

    const updatedEquipment = [...selectedEquipment];

    if (existingIndex > -1) {
      updatedEquipment[existingIndex].quantity += quantity;
    } else {
      updatedEquipment.push({
        equipmentId: equipment._id,
        quantity,
        name: equipment.name,
        pricePerUnit: equipment.pricePerUnit,
      });
    }

    setSelectedEquipment(updatedEquipment);
  };

  /**
   * Remove equipment from selection
   * @param {string} equipmentId
   */
  const removeEquipment = (equipmentId) => {
    const updatedEquipment = selectedEquipment.filter(
      (item) => item.equipmentId !== equipmentId
    );
    setSelectedEquipment(updatedEquipment);
  };

  /**
   * Update equipment quantity
   * @param {string} equipmentId
   * @param {number} quantity
   */
  const updateEquipmentQuantity = (equipmentId, quantity) => {
    if (quantity <= 0) {
      removeEquipment(equipmentId);
      return;
    }

    const updatedEquipment = selectedEquipment.map((item) => {
      if (item.equipmentId === equipmentId) {
        return { ...item, quantity };
      }
      return item;
    });

    setSelectedEquipment(updatedEquipment);
  };

  /**
   * Get total equipment price
   * @returns {number}
   */
  const getEquipmentTotal = () => {
    return selectedEquipment.reduce((total, item) => {
      return total + item.quantity * item.pricePerUnit;
    }, 0);
  };

  /**
   * Get coach price
   * @returns {number}
   */
  const getCoachPrice = () => {
    return selectedCoach ? selectedCoach.pricePerHour : 0;
  };

  /**
   * Get booking summary
   * @returns {object}
   */
  const getBookingSummary = () => {
    return {
      court: selectedCourt,
      coach: selectedCoach,
      equipment: selectedEquipment,
      time: selectedTime,
      price: priceBreakdown,
      isComplete: isBookingComplete(),
    };
  };

  return {
    // State
    selectedCourt,
    selectedEquipment,
    selectedCoach,
    selectedTime,
    priceBreakdown,

    // Setters
    setSelectedCourt,
    setSelectedEquipment,
    setSelectedCoach,
    setSelectedTime,
    setPriceBreakdown,

    // Utility functions
    resetBooking,
    isBookingComplete,
    addEquipment,
    removeEquipment,
    updateEquipmentQuantity,
    getEquipmentTotal,
    getCoachPrice,
    getBookingSummary,
  };
};
