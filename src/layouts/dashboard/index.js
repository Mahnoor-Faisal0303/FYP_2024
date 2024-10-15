import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import Card from "components/Card";
import Task from "components/Task";
import { Typography, Box, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { db } from "../../layouts/authentication/FirebaseConfig";
import { getDocs, updateDoc, doc, deleteDoc,collection } from "firebase/firestore";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [totalTask, setTotalTask] = useState(0);
  const [todoTaskCount, setTodoTaskCount] = useState(0);
  const [todoTaskPerc, setTodoTaskPerc] = useState(0);

  const [inprogressTaskCount, setInprogressTaskCount] = useState(0);
  const [inprogressTaskPerc, setInprogressTaskPerc] = useState(0);

  const [testingTaskCount, setTestingTaskCount] = useState(0);
  const [testingTaskPerc, setTestingTaskPerc] = useState(0);

  const [doneTaskCount, setDoneTaskCount] = useState(0);
  const [doneTaskPerc, setDoneTaskPerc] = useState(0);
  
  console.log("todo",todoTaskCount,"innn",inprogressTaskCount);
useEffect(()=> {
  const totalTasks = async() => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    let documentCount = 0; 
    let todoCount = 0;
    let inProgressCount = 0;
    let testingCount = 0;
    let doneCount = 0;

       querySnapshot.forEach(async(document) => {
        documentCount += 1;
        if (document.data().status === "todo") {
          todoCount += 1;
        }
        if (document.data().status === "inprogress") {
          inProgressCount += 1;
        }
        if (document.data().status === "testing") {
          testingCount += 1;
        }
        if (document.data().status === "done") {
          doneCount += 1;
        }
       });
       let p1 = ((todoCount*100)/documentCount);
       let p2 = ((inProgressCount*100)/documentCount);
       let p3 = ((testingCount*100)/documentCount);
       let p4 = ((doneCount*100)/documentCount);

       setTodoTaskCount(todoCount);
       setTodoTaskPerc(p1.toFixed(0));

       setTotalTask(documentCount);

       setInprogressTaskCount(inProgressCount);
       setInprogressTaskPerc(p2.toFixed(0))

       setTestingTaskCount(testingCount);
       setTestingTaskPerc(p3.toFixed(0));

       setDoneTaskCount(doneCount);
       setDoneTaskPerc(p4.toFixed(0));
    }
    totalTasks();
}, []);

  return (
    <DashboardLayout>
      <Box>
        <DashboardNavbar />
      </Box>
      <Typography variant="h3" sx={{ ml: "2%" }} fontFamily="Raleway">
        Welcome To NLP TaskPRO Dashboards
      </Typography>
      {/* <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <Typography variant="h4" fontFamily="Raleway" fontWeight={600}>
                Inprogress 12 tasks
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card height="80px" width="200px">
              <Typography variant="h4" fontFamily="Raleway" fontWeight={600}>
                Unassigned 0 tasks
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card height="80px" width="200px">
              <Typography variant="h4" fontFamily="Raleway" fontWeight={600}>
                completed 2 tasks
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card height="80px" width="200px">
              <Typography variant="h4" fontFamily="Raleway" fontWeight={600}>
                4 completed tasks this week
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </MDBox> */}

      <MDBox py={6}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="queue"
                title="In Queue"
                count={todoTaskCount}
                percentage2={12}
                percentage={{
                  color: "success",
                  amount: todoTaskPerc,
                  label: "tasks",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="In Progress"
                count={inprogressTaskCount}
                color="primary"
                percentage={{
                  color: "success",
                  amount: inprogressTaskPerc,
                  label: "tasks",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="dangerous"
                title="Testing"
                count={testingTaskCount}
                percentage={{
                  color: "success",
                  amount: testingTaskPerc,
                  label: "tasks",
                }}
                //percentage2={12}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="done"
                title="Done"
                count={doneTaskCount}
                percentage={{
                  color: "success",
                  amount: doneTaskPerc,
                  label: "tasks",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title={`Number of Tasks ${totalTask}`}
                  description="Total number of tasks assigned this week"
                  date="updated 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Completed Tasks this month"
                  description="Completed tasks this month"
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Total completed tasks"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Dashboard;
