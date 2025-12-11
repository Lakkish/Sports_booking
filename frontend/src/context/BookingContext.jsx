import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Create context
export const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  // Main booking state
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedTime, setSelectedTime] = useState({});
  const [priceBreakdown, setPriceBreakdown] = useState({});

  // Additional state for enhanced booking experience
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingErrors, setBookingErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save booking draft to localStorage
  const [bookingDraft, setBookingDraft] = useLocalStorage("bookingDraft", null);

  // Load booking draft on mount
  useState(() => {
    if (bookingDraft) {
      const { court, equipment, coach, time, step } = bookingDraft;

      if (court) setSelectedCourt(court);
      if (equipment) setSelectedEquipment(equipment);
      if (coach) setSelectedCoach(coach);
      if (time) setSelectedTime(time);
      if (step) setBookingStep(step);
    }
  }, []);

  // Save booking draft whenever state changes
  useEffect(() => {
    const draft = {
      court: selectedCourt,
      equipment: selectedEquipment,
      coach: selectedCoach,
      time: selectedTime,
      step: bookingStep,
      savedAt: new Date().toISOString(),
    };

    setBookingDraft(draft);
  }, [
    selectedCourt,
    selectedEquipment,
    selectedCoach,
    selectedTime,
    bookingStep,
  ]);

  // Reset all booking selections
  const resetBooking = useCallback(() => {
    setSelectedCourt(null);
    setSelectedEquipment([]);
    setSelectedCoach(null);
    setSelectedTime({});
    setPriceBreakdown({});
    setBookingStep(1);
    setBookingErrors({});
    setIsSubmitting(false);
    setBookingDraft(null);

    // Clear from localStorage
    localStorage.removeItem("bookingDraft");
  }, [setBookingDraft]);

  // Validate booking completeness
  const isBookingComplete = useCallback(() => {
    return selectedCourt && selectedTime.start && selectedTime.end;
  }, [selectedCourt, selectedTime]);

  // Validate specific booking step
  const validateStep = useCallback(
    (step) => {
      const errors = {};

      switch (step) {
        case 1: // Court selection
          if (!selectedCourt) {
            errors.court = "Please select a court";
          }
          break;

        case 2: // Extras selection (no validation needed as optional)
          break;

        case 3: // Time selection
          if (!selectedTime.start || !selectedTime.end) {
            errors.time = "Please select a time slot";
          }
          break;

        case 4: // Confirmation
          if (!isBookingComplete()) {
            errors.complete = "Please complete all required selections";
          }
          break;

        default:
          break;
      }

      setBookingErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [selectedCourt, selectedTime, isBookingComplete]
  );

  // Navigate to next step with validation
  const nextStep = useCallback(() => {
    if (validateStep(bookingStep)) {
      setBookingStep((prev) => Math.min(prev + 1, 4));
      return true;
    }
    return false;
  }, [bookingStep, validateStep]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    setBookingStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Jump to specific step
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 4) {
      setBookingStep(step);
    }
  }, []);

  // Equipment management functions
  const addEquipment = useCallback(
    (equipment, quantity = 1) => {
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
          maxStock: equipment.totalStock,
        });
      }

      setSelectedEquipment(updatedEquipment);
    },
    [selectedEquipment]
  );

  const removeEquipment = useCallback(
    (equipmentId) => {
      const updatedEquipment = selectedEquipment.filter(
        (item) => item.equipmentId !== equipmentId
      );
      setSelectedEquipment(updatedEquipment);
    },
    [selectedEquipment]
  );

  const updateEquipmentQuantity = useCallback(
    (equipmentId, quantity) => {
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
    },
    [selectedEquipment, removeEquipment]
  );

  const clearEquipment = useCallback(() => {
    setSelectedEquipment([]);
  }, []);

  // Calculate equipment total price
  const getEquipmentTotal = useCallback(() => {
    return selectedEquipment.reduce((total, item) => {
      return total + item.quantity * (item.pricePerUnit || 0);
    }, 0);
  }, [selectedEquipment]);

  // Calculate coach price
  const getCoachPrice = useCallback(() => {
    return selectedCoach ? selectedCoach.pricePerHour : 0;
  }, [selectedCoach]);

  // Get booking summary object
  const getBookingSummary = useCallback(() => {
    return {
      court: selectedCourt,
      equipment: selectedEquipment,
      coach: selectedCoach,
      time: selectedTime,
      price: priceBreakdown,
      isComplete: isBookingComplete(),
      step: bookingStep,
      totalItems: selectedEquipment.length + (selectedCoach ? 1 : 0),
    };
  }, [
    selectedCourt,
    selectedEquipment,
    selectedCoach,
    selectedTime,
    priceBreakdown,
    isBookingComplete,
    bookingStep,
  ]);

  // Get booking payload for API
  const getBookingPayload = useCallback(() => {
    return {
      court: selectedCourt?._id,
      coach: selectedCoach?._id || null,
      equipment: selectedEquipment.map((e) => ({
        equipmentId: e.equipmentId,
        quantity: e.quantity,
      })),
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      notes: "", // Optional notes field
    };
  }, [selectedCourt, selectedCoach, selectedEquipment, selectedTime]);

  // Check if time slot is selected
  const hasTimeSlot = useCallback(() => {
    return !!selectedTime.start && !!selectedTime.end;
  }, [selectedTime]);

  // Check if equipment is selected
  const hasEquipment = useCallback(() => {
    return selectedEquipment.length > 0;
  }, [selectedEquipment]);

  // Check if coach is selected
  const hasCoach = useCallback(() => {
    return !!selectedCoach;
  }, [selectedCoach]);

  // Calculate total hours from selected time
  const getTotalHours = useCallback(() => {
    if (!selectedTime.start || !selectedTime.end) return 0;

    const start = new Date(selectedTime.start);
    const end = new Date(selectedTime.end);
    const hours = (end - start) / (1000 * 60 * 60);

    return Math.max(hours, 1); // Minimum 1 hour
  }, [selectedTime]);

  // Context value with memoization for performance
  const contextValue = useMemo(
    () => ({
      // State
      selectedCourt,
      selectedEquipment,
      selectedCoach,
      selectedTime,
      priceBreakdown,
      bookingStep,
      bookingErrors,
      isSubmitting,

      // State setters
      setSelectedCourt,
      setSelectedEquipment,
      setSelectedCoach,
      setSelectedTime,
      setPriceBreakdown,
      setBookingStep,
      setBookingErrors,
      setIsSubmitting,

      // Actions
      resetBooking,
      nextStep,
      prevStep,
      goToStep,

      // Equipment management
      addEquipment,
      removeEquipment,
      updateEquipmentQuantity,
      clearEquipment,

      // Validation & checks
      isBookingComplete,
      validateStep,
      hasTimeSlot,
      hasEquipment,
      hasCoach,

      // Calculations
      getEquipmentTotal,
      getCoachPrice,
      getTotalHours,

      // Data getters
      getBookingSummary,
      getBookingPayload,

      // Convenience properties
      hasExtras: selectedEquipment.length > 0 || !!selectedCoach,
      totalExtras: selectedEquipment.length + (selectedCoach ? 1 : 0),
      isStepValid: (step) => validateStep(step),
      canProceed: bookingStep < 4,
      canGoBack: bookingStep > 1,
    }),
    [
      selectedCourt,
      selectedEquipment,
      selectedCoach,
      selectedTime,
      priceBreakdown,
      bookingStep,
      bookingErrors,
      isSubmitting,
      resetBooking,
      nextStep,
      prevStep,
      goToStep,
      addEquipment,
      removeEquipment,
      updateEquipmentQuantity,
      clearEquipment,
      isBookingComplete,
      validateStep,
      hasTimeSlot,
      hasEquipment,
      hasCoach,
      getEquipmentTotal,
      getCoachPrice,
      getTotalHours,
      getBookingSummary,
      getBookingPayload,
    ]
  );

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook for using booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
