import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/accommodations");

      setListings(response.data.accommodations || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not load listings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id,
    currentStatus
  ) => {
    try {
      await api.patch(
        `/admin/accommodations/${id}/status`,
        {
          isActive: !currentStatus,
        }
      );

      setListings((current) =>
        current.map((listing) =>
          listing._id === id
            ? {
                ...listing,
                isActive: !currentStatus,
              }
            : listing
        )
      );

      toast.success("Listing updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to update listing."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this listing?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/admin/accommodations/${id}`
      );

      setListings((current) =>
        current.filter(
          (listing) => listing._id !== id
        )
      );

      toast.success("Listing deleted.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete listing."
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
        <h1>Manage Listings</h1>

        <p>
          View, activate, deactivate and delete
          accommodation listings.
        </p>

        {loading ? (
          <h3>Loading listings...</h3>
        ) : listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "25px",
              background: "#fff",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Title</th>
                <th style={headerStyle}>Host</th>
                <th style={headerStyle}>Location</th>
                <th style={headerStyle}>Price</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Action</th>
                <th style={headerStyle}>Delete</th>
              </tr>
            </thead>

            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td style={cellStyle}>
                    {listing.title}
                  </td>

                  <td style={cellStyle}>
                    {listing.host?.username ||
                      listing.hostName ||
                      "Unknown"}
                  </td>

                  <td style={cellStyle}>
                    {listing.location}
                  </td>

                  <td style={cellStyle}>
                    R {listing.price}
                  </td>

                  <td style={cellStyle}>
                    {listing.isActive
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          listing._id,
                          listing.isActive
                        )
                      }
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor:
                          listing.isActive
                            ? "#f4b400"
                            : "#34a853",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {listing.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>

                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          listing._id
                        )
                      }
                      style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#d93025",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
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
  background: "#f5f5f5",
  textAlign: "left",
};

const cellStyle = {
  padding: "14px",
  border: "1px solid #ddd",
};

export default Listings;