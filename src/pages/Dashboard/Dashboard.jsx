import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "30px" }}>
        <h1>Admin Dashboard</h1>

        {dashboard ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 250px)",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>Total Users</h3>
                <h2>{dashboard.users.total}</h2>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>Total Listings</h3>
                <h2>{dashboard.listings.total}</h2>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>Reservations</h3>
                <h2>{dashboard.reservations.total}</h2>
              </div>

              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <h3>Total Revenue</h3>
                <h2>R {dashboard.finances.totalRevenue}</h2>
              </div>
            </div>
          </>
        ) : (
          <p>Failed to load dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;