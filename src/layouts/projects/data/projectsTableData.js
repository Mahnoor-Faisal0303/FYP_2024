
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../authentication/FirebaseConfig";


export default function data() {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const getProjects = onSnapshot(collection(db, "project"), (querySnapshot) => {
      const projects = [];
      querySnapshot.forEach((doc) => {
       //projects.push(doc.data());
        projects.push({ id: doc.id, ...doc.data() }); // Include the document ID
      });
      setProjectData(projects);
    });

    return () => getProjects();
  }, []);

  async function deleteProject(docId) {
    try {
      await deleteDoc(doc(db, "project", docId));
      console.log(`Deleted project with ID: ${docId}`);
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  }

  return {
    columns: [
      { Header: "project", accessor: "project", align: "left" },
      { Header: "Description",accessor: "description",  align: "left" },
      { Header: "Action",accessor: "action",  align: "center" },
    ],

    rows: projectData.map((project , index) => ({
      project: (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={LogoAsana} name={"hello"} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {project.name}
      </MDTypography>
      </MDBox>
      ),
      // budget: (
      //   <MDTypography component="a" variant="button" color="text" fontWeight="medium">
      //    Rs. {project.budget}.00
      //   </MDTypography>
      // ),
      description: (
        <MDTypography component="a" variant="button" color="text" fontWeight="medium" sx={{width:"300px"}}>
         {project.description}
        </MDTypography>
      ),
      action: (
        <IconButton onClick={() => deleteProject(project.id)}>
              <DeleteIcon />
            </IconButton>
        // <MDTypography component="a" variant="button" color="red" fontWeight="medium">
        //  <DeleteIcon />
        // </MDTypography>
      ),
      // status: (
      //   <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
      //     {project.status}
      //   </MDTypography>
      // ),
      // completion: <Progress color={project.completionColor} value={project.completionValue} />,
      // action: (
      //   <MDTypography component="a" href="#" color="text">
      //     <Icon>more_vert</Icon>
      //   </MDTypography>
      // ),
    }))
  };
}
