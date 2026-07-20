import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Users could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, {
        role,
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user
        )
      );

      toast.success("User role updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Role could not be updated"
      );
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userId
        )
      );

      toast.success("User deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "User could not be deleted"
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
        <h1>Manage Users</h1>

        <p>
          View users, change their roles or delete
          accounts.
        </p>

        {loading ? (
          <h3>Loading users...</h3>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "25px",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr>
                <th style={headerStyle}>Username</th>
                <th style={headerStyle}>Email</th>
                <th style={headerStyle}>Role</th>
                <th style={headerStyle}>Change Role</th>
                <th style={headerStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={cellStyle}>
                    {user.username}
                  </td>

                  <td style={cellStyle}>
                    {user.email}
                  </td>

                  <td style={cellStyle}>
                    {user.role}
                  </td>

                  <td style={cellStyle}>
                    <select
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(
                          user._id,
                          event.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="host">
                        Host
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </td>

                  <td style={cellStyle}>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(user._id)
                      }
                      style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#d93025",
                        color: "white",
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
  backgroundColor: "#f5f5f5",
  textAlign: "left",
};

const cellStyle = {
  padding: "14px",
  border: "1px solid #ddd",
};

export default Users;