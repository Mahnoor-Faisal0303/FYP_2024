
import React, { createContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import PropTypes from "prop-types"; // Import PropTypes
import { db } from "../layouts/authentication/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [defaultProject, setDefaultProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const projectsCollection = collection(db, "project"); // Collection name: "project"

            try {
                const snapshot = await getDocs(projectsCollection);
                const projectList = snapshot.docs.map((doc) => ({
                    id: doc.id, // Use Firestore document ID as `id`
                    ...doc.data(),
                }));

                setProjects(projectList);

                // Set the first project as default if not already set
                if (!defaultProject && projectList.length > 0) {
                    setDefaultProject(projectList[0]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [defaultProject]);

    const updateDefaultProject = (project) => {
        setDefaultProject(project);
    };

    return (
        <ProjectContext.Provider value={{ projects, defaultProject, updateDefaultProject }}>
            {children}
        </ProjectContext.Provider>
    );
};


// Add PropTypes validation
ProjectProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validate children as a React node
};

export default ProjectProvider;