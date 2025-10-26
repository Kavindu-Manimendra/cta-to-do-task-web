package org.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.backend.repo.TaskRepo;
import org.junit.jupiter.api.*;
import org.backend.dtos.TaskDto;
import org.backend.model.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
@Transactional
@Rollback
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private ObjectMapper objectMapper;

    // POST /create-task
    @Test
    void createTask_withValidData_returns201_andPersistsTask() throws Exception {
        TaskDto dto = new TaskDto();
        dto.setTitle("Integration Test Task");
        dto.setDescription("Full flow test");

        mockMvc.perform(post("/api/v1/task/create-task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Task has been successfully created."))
                .andExpect(jsonPath("$.data.title").value("Integration Test Task"));

        List<Task> saved = taskRepo.findAll();
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).getTitle()).isEqualTo("Integration Test Task");
        assertThat(saved.get(0).isCompleted()).isFalse();
    }

    @Test
    void createTask_withEmptyTitle_returns400_andNoPersistence() throws Exception {
        TaskDto dto = new TaskDto();
        dto.setTitle("   ");
        dto.setDescription("desc");

        mockMvc.perform(post("/api/v1/task/create-task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Task title must not be empty."));

        assertThat(taskRepo.findAll()).isEmpty();
    }

    // GET /mark-task/{id}
    @Test
    void markTask_withValidId_marksTaskCompleted_andReturns200() throws Exception {
        Task task = new Task();
        task.setTitle("Markable");
        task.setDescription("to be marked");
        task.setCompleted(false);
        taskRepo.save(task);

        mockMvc.perform(get("/api/v1/task/mark-task/" + task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Task has been successfully marked."));

        Task updated = taskRepo.findById(task.getId()).orElseThrow();
        assertThat(updated.isCompleted()).isTrue();
    }

    @Test
    void markTask_withNonExistingId_returns404() throws Exception {
        mockMvc.perform(get("/api/v1/task/mark-task/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Task not found."));
    }

    @Test
    void markTask_withInvalidIdFormat_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/task/mark-task/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("For input string: \"abc\""));
    }

    // GET /get-recent_tasks
    @Test
    void getRecentTasks_returnsListOfUncompletedTasksOrderedByCreatedAtDesc() throws Exception {
        Task oldTask = new Task(null, "Old", "desc", java.time.Instant.now().minusSeconds(3600), false);
        Task recentTask = new Task(null, "Recent", "desc", java.time.Instant.now(), false);
        Task completedTask = new Task(null, "Done", "desc", java.time.Instant.now(), true);
        taskRepo.saveAll(List.of(oldTask, recentTask, completedTask));

        mockMvc.perform(get("/api/v1/task/get-recent_tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Tasks retrieved successfully."))
                .andExpect(jsonPath("$.data[0].title").value("Recent"))
                .andExpect(jsonPath("$.data[1].title").value("Old"));

        List<Task> tasks = taskRepo.findTop5ByCompletedFalseOrderByCreatedAtDesc();
        assertThat(tasks).hasSize(2);
        assertThat(tasks.get(0).getTitle()).isEqualTo("Recent");
    }

    @Test
    void getRecentTasks_whenNoTasks_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/task/get-recent_tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tasks retrieved successfully."))
                .andExpect(jsonPath("$.data").isEmpty());
    }
}
