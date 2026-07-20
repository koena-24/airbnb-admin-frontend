import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/reservations");

      setReservations(response.data.reservations || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reservations/${id}/status`, {
        status,
      });

      setReservations((current) =>
        current.map((reservation) =>
          reservation._id === id
            ? { ...reservation, status }
            : reservation
        )
      );

      toast.success("Reservation updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not update reservation."
      );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "30px",
          overflowX: "auto",
        }}
      >
        <h1>Manage Reservations</h1>

        <p>
          View and manage all customer reservations.
        </p>

        {loading ? (
          <h3>Loading reservations...</h3>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "25px",
              backgroundColor: "#fff",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Guest</th>
                <th style={headerStyle}>Host</th>
                <th style={headerStyle}>Listing</th>
                <th style={headerStyle}>Check In</th>
                <th style={headerStyle}>Check Out</th>
                <th style={headerStyle}>Guests</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td style={cellStyle}>
                    {reservation.guest?.username}
                  </td>

                  <td style={cellStyle}>
                    {reservation.host?.username}
                  </td>

                  <td style={cellStyle}>
                    {reservation.accommodation?.title}
                  </td>

                  <td style={cellStyle}>
                    {new Date(
                      reservation.checkIn
                    ).toLocaleDateString()}
                  </td>

                  <td style={cellStyle}>
                    {new Date(
                      reservation.checkOut
                    ).toLocaleDateString()}
                  </td>

                  <td style={cellStyle}>
                    {reservation.guests}
                  </td>

                  <td style={cellStyle}>
                    R {reservation.totalPrice}
                  </td>

                  <td style={cellStyle}>
                    <select
                      value={reservation.status}
                      onChange={(e) =>
                        updateStatus(
                          reservation._id,
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "5px",
                      }}
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="confirmed">
                        Confirmed
                      </option>

                      <option value="completed">
                        Completed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

const headerStyle = {
  padding: "14px",
  border: "1px solid #ddd",
  backgroundColor: "#f5f5f5",
  textAlign: "left",
};

const cellStyle = {
  padding: "14px",
  border: "1px solid #ddd",
};

export default Reservations;