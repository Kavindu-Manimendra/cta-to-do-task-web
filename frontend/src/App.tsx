import './App.css'
import {Box, Container, Divider, Stack} from "@mui/material";
import CreateTaskForm from "./components/CreateTaskForm.tsx";
import TaskList from "./components/TaskList.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
      <Box
          sx={{
              backgroundColor: "#DADADA",
              p: { xs: 1, sm: 2, md: 3 },
              border: "1px solid black",
              borderRadius: 4,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
          }}
      >
          <QueryClientProvider client={queryClient}>
              <Container
                  sx={{
                      backgroundColor: "#ffffff",
                      p: 2,
                      borderRadius: 4,
                      display: "flex",
                      justifyContent: "center",
                      height: { xs: "auto", md: "90vh" },
                  }}
              >
                  <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={{ xs: 2, md: 3 }}
                      divider={
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{
                              borderWidth: 2
                          }}
                        />
                      }
                  >
                      <CreateTaskForm />
                      <TaskList />
                  </Stack>
              </Container>
          </QueryClientProvider>
      </Box>
  );
};

export default App;
