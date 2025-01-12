
import { ProjectContext } from "../../../../providers/ProjectProvider";
import React, { useContext } from "react";

const ProjectDropdown = () => {
    const { projects, defaultProject, updateDefaultProject } = useContext(ProjectContext);

    const handleChange = (event) => {
        const selectedProject = projects.find((proj) => proj.id === event.target.value);
        updateDefaultProject(selectedProject);
    };

    //   if (!projects.length) return <p>Loading projects...</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
            <label htmlFor="project-selector" style={{ marginBottom: "5px", fontWeight: "bold" }}>
                Select Project:
            </label>
            <select
                id="project-selector"
                value={defaultProject?.id || ""}
                onChange={handleChange}
                style={{
                    padding: "8px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                }}
            >
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectDropdown;
