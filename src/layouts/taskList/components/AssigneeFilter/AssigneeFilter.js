import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AssigneeFilter = ({ onAssigneeChange }) => {
    const [users, setUsers] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore();
            const usersCollection = collection(db, "users"); // Firestore collection name: "users"

            try {
                const snapshot = await getDocs(usersCollection);
                const userList = snapshot.docs.map((doc) => ({
                    name: doc.data().name, // Use the "name" field as the id and display value
                }));

                setUsers(userList);

                // Optionally set the first user as the default assignee
                // if (userList.length > 0) {
                //     setSelectedAssignee(userList[0].name);
                //     if (onAssigneeChange) {
                //         onAssigneeChange(userList[0].name);
                //     }
                // }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (event) => {
        const newAssignee = event.target.value;
        setSelectedAssignee(newAssignee);

        if (onAssigneeChange) {
            onAssigneeChange(newAssignee); // Pass the selected assignee to the parent component
        }
    };

    // if (!users.length) return <p>Loading users...</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
            <label htmlFor="assignee-selector" style={{ marginBottom: "5px", fontWeight: "bold" }}>
                Filter By Assignee:
            </label>
            <select
                id="assignee-selector"
                value={selectedAssignee}
                onChange={handleChange}
                style={{
                    padding: "8px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                }}
            >
                <option value="" disabled>Select an Assignee</option> {/* Default unselected option */}
                <option value="all">All</option> {/* Add "All" option */}
                {users.map((user) => (
                    <option key={user.name} value={user.name}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

// PropTypes validation
AssigneeFilter.propTypes = {
    onAssigneeChange: PropTypes.func, // Callback for handling the selected assignee
};

export default AssigneeFilter;
