import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function createData(id,todos, inprogress, testing, done) {
  return {id, todos, inprogress, testing, done };
}

const rows = [
  createData(1,"Task A", 159, 6.0, 24),
  createData(2,"Task B", 237, 9.0, 37),
  createData(3,"Task C", 262, 16.0, 24),
  createData(4,"Task D", 305, 3.7, 67),
  createData(5,"Task E", 356, 16.0, 49),
];

function Billing() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8} sx={{ marginBottom: "220px" }}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableRow>
            <TableCell sx={{fontSize:"40px",fontWeight:500,width:"30px" }}>#</TableCell>
                <TableCell sx={{fontSize:"40px",fontWeight:500 }}>To Do</TableCell>
                <TableCell sx={{fontSize:"40px",fontWeight:500 }}>In Progress</TableCell>
                <TableCell sx={{fontSize:"40px",fontWeight:500 }}>Testing</TableCell>
                <TableCell sx={{fontSize:"40px",fontWeight:500 }}>Done</TableCell>
            </TableRow>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.todos}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }}}
                >
                  <TableCell>
                  <div style={{padding:"4px",height:"70px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {row.id}
                    </div>
                    </TableCell>
                  <TableCell component="th" scope="row">
                    <div style={{background:"orange",padding:"4px",height:"70px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {row.todos}
                    </div>
                  </TableCell>
                  <TableCell>
                  <div style={{background:"lightgreen",padding:"4px",height:"70px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {row.inprogress}
                  </div>
                  </TableCell>
                  <TableCell>
                  <div style={{background:"yellow",padding:"4px",height:"70px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {row.testing}
                    </div>
                    </TableCell>

                  <TableCell>
                  <div style={{background:"green",padding:"4px",height:"70px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {row.done}
                    </div>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
