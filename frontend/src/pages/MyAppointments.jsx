import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  // Fetch user appointments from the database
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch appointments. Please try again.");
    }
  };

  // Cancel the user appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Open the dummy payment interface
  const openPaymentInterface = (appointmentId, fees) => {
    setIsPaymentVisible(true);
    setSelectedAppointment(appointmentId);
    setSelectedPrice(fees);
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/mark-payment",
        { appointmentId: selectedAppointment },
        { headers: { token } }
      );

      if (data.success) {
        // Update local state to reflect payment completion
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === selectedAppointment
              ? { ...appointment, payment: true }
              : appointment
          )
        );
        toast.success("Payment Completed Successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to mark payment. Please try again.");
    } finally {
      setIsPaymentVisible(false);
    }
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    setIsPaymentVisible(false);
    toast.error("Payment Cancelled");
  };

  // Effect hook to get appointments on token change
  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="flex items-center gap-4 py-4 border-b"
            key={index}
          >
            {/* Doctor's Image */}
            <div className="flex-shrink-0">
              <img
                className="w-32 h-32 bg-indigo-50 object-cover rounded"
                src={item.docData.image}
                alt={item.docData.name}
              />
            </div>

            {/* Doctor and Appointment Details */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
              <p className="text-sm mt-1 text-green-600 font-medium">
                Consultation Fee: ₹{item.docData.fees || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Only show Pay Online if appointment is not cancelled or paid */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() =>
                    openPaymentInterface(item._id, item.docData.fees)
                  }
                  className="text-sm text-stone-500 text-center py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {/* Only show Cancel button if appointment is not cancelled or paid */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="py-2 px-4 border border-red-500 rounded text-red-500 ">
                  Appointment cancelled
                </button>
              )}
               {item.payment && !item.cancelled && !item.isCompleted &&<button className='sm:min-w-48 py-2 px-4 border border-green-500 rounded text-green-500'>Paid</button>}

               {item.isCompleted && <button className='sm:min-w-48 py-2 px-4 border border-green-500 rounded text-green-500 bg-green-200'>Completed</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Dummy Razorpay-like Payment Interface */}
      {isPaymentVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <p className="mb-2">Appointment ID: {selectedAppointment}</p>
            <p className="mb-4 text-green-600 font-medium">
              Amount to Pay: ₹{selectedPrice}
            </p>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Card Number"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="MM/YY (Expiry Date)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="CVV"
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handlePaymentCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSuccess}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Pay ₹{selectedPrice}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
