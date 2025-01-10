/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../authentication/FirebaseConfig";

export default function data() {
  const [userName, setUserName] = useState([]);
  const [userEmail, setUserEmail] = useState([]);

  const [todos, setTodos] = useState([12, 13, 14, 15]);
  const [inprogress, setInprogress] = useState([11, 10, 1, 1]);
  const [testing, setTesting] = useState([1, 2, 3, 4]);
  const [done, setDone] = useState([1, 2, 1, 1]);
  const [totalTask, setTotalTask] = useState([100, 18, 12, 44]);

  // useEffect(() => {
  //   const getUsers = () => {
  //     onSnapshot(collection(db, "users"), (querySnapshot) => {
  //       const usersData = [];
  //       const emailsData = [];

  //       querySnapshot.forEach((doc) => {
  //         const docData = doc.data();
  //         usersData.push(capitalizeName(docData.name));
  //         emailsData.push(docData.email);
  //       });

  //       setUserName(usersData);
  //       setUserEmail(emailsData);
  //     });
  //   };

  //   // const gettasks = () => {
  //   //   onSnapshot(collection(db, "tasks"), (querySnapshot) => {

  //   //     querySnapshot.forEach((doc) => {
  //   //       const docData = doc.data();
  //   //       console.log(docData.assignee,docData.status,"getting task");
  //   //     });
  //   //   });
  //   // };
  //   const getTasks = () => {

  //     onSnapshot(collection(db, "tasks"), (querySnapshot) => {
  //       taskData = [];

  //       querySnapshot.forEach((doc) => {
  //         const docData = doc.data();
  //         taskData.push({
  //           assignee: docData.assignee,
  //           status: docData.status,
  //         });
  //       });

  //        console.log(taskData, "Task Data");

  //        const countTodosForMahnoor = taskData.filter(
  //         (task) => task.assignee.toLowerCase() === "mahnoor" && task.status.toLowerCase() === "todo"
  //       ).length;

  //       console.log(`Mahnoor has ${countTodosForMahnoor} 'todo' tasks.`);
  //     });
  //   };

  //   getUsers();
  //   getTasks();
  // }, []);

  // const capitalizeName = (name) => {
  //   if (!name) return "";
  //   return name
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  //     .join(" ");
  // };
  useEffect(() => {
    const getUsers = () => {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        const usersData = [];
        const emailsData = [];

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          usersData.push(capitalizeName(docData.name));
          emailsData.push(docData.email);
        });

        setUserName(usersData);
        setUserEmail(emailsData);
      });
    };
    getUsers();
  }, []);
  useEffect(() => {
    const getTasks = () => {
      onSnapshot(collection(db, "tasks"), (querySnapshot) => {
        const taskData = [];
        const todoData = [];
        const inProgressData = [];
        const testingData = [];
        const doneData = [];
        const totalData = [];

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          taskData.push({
            assignee: docData.assignee,
            status: docData.status,
          });
        });

        console.log(taskData, "Task Data");
        userName.forEach((name) => {
          todoData.push(
            taskData.filter((item) => {
              return item.assignee.toLowerCase() === name.toLowerCase() && item.status === "todo";
            }).length + ""
          );
          inProgressData.push(
            taskData.filter((item) => {
              return (
                item.assignee.toLowerCase() === name.toLowerCase() && item.status === "inprogress"
              );
            }).length + ""
          );
          testingData.push(
            taskData.filter((item) => {
              return (
                item.assignee.toLowerCase() === name.toLowerCase() && item.status === "testing"
              );
            }).length + ""
          );
          doneData.push(
            taskData.filter((item) => {
              return item.assignee.toLowerCase() === name.toLowerCase() && item.status === "done";
            }).length + ""
          );
          totalData.push(
            taskData.filter((item) => {
              return item.assignee.toLowerCase() === name.toLowerCase();
            }).length + ""
          );
        });
        setTodos(todoData);
        setInprogress(inProgressData);
        setTesting(testingData);
        setDone(doneData);
        setTotalTask(totalData);
      });
    };
    getTasks();
  }, [userName]);

  const capitalizeName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const Author = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const BadgeContent = ({ content }) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={content}
        color={content > 10 ? "info" : "warning"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  const rows = userName.map((name, index) => ({
    author: <Author name={name} email={userEmail[index]} />,
    function: <Job title="User Role" description="Some Description" />,
    status: <BadgeContent content={todos[index] || 0} />,
    inProgress: <BadgeContent content={inprogress[index] || 0} />,
    testing: <BadgeContent content={testing[index] || 0} />,
    done: <BadgeContent content={done[index] || 0} />,
    totalTask: <BadgeContent content={totalTask[index] || 0} />,
  }));

  return {
    columns: [
      { Header: "User", accessor: "author", width: "45%", align: "left" },
      { Header: "Todo", accessor: "status", align: "center" },
      { Header: "In Progress", accessor: "inProgress", align: "center" },
      { Header: "Testing", accessor: "testing", align: "center" },
      { Header: "Done", accessor: "done", align: "center" },
      { Header: "Total Task", accessor: "totalTask", align: "center" },
    ],

    rows,
  };
}
