package org.backend.service;

import org.backend.dtos.TaskDto;
import org.backend.exception.CreateTaskFailedException;
import org.backend.exception.TaskNotFoundException;
import org.backend.model.Task;
import org.backend.repo.TaskRepo;
import org.backend.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.MockitoAnnotations;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class TaskServiceTest {
    @Mock
    private TaskRepo taskRepo;
    @InjectMocks
    private TaskServiceImpl  taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // create-task
    @Test
    void createTask_withValidDto_savesAndReturnsTask() throws CreateTaskFailedException {
        TaskDto dto = new TaskDto();
        dto.setTitle("Test Title");
        dto.setDescription("desc");

        Task saved = new Task();
        saved.setId(1L);
        saved.setTitle(dto.getTitle());
        saved.setDescription(dto.getDescription());
        saved.setCreatedAt(Instant.now());
        saved.setCompleted(false);

        when(taskRepo.save(any(Task.class))).thenReturn(saved);

        Task result = taskService.createTask(dto);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Title");

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepo, times(1)).save(captor.capture());
        Task toSave = captor.getValue();
        assertThat(toSave.getTitle()).isEqualTo(dto.getTitle());
        assertThat(toSave.getDescription()).isEqualTo(dto.getDescription());
    }


    @Test
    void createTask_withNullDto_throwsCreateTaskFailedException() {
        assertThatThrownBy(() -> taskService.createTask(null))
                .isInstanceOf(CreateTaskFailedException.class)
                .hasMessageContaining("Task data must not be null");
        verify(taskRepo, never()).save(any());
    }

    @Test
    void createTask_withBlankTitle_throwsCreateTaskFailedException() {
        TaskDto dto = new TaskDto();
        dto.setTitle("   ");
        dto.setDescription("desc");

        assertThatThrownBy(() -> taskService.createTask(dto))
                .isInstanceOf(CreateTaskFailedException.class)
                .hasMessageContaining("Task title must not be empty");
        verify(taskRepo, never()).save(any());
    }

    // mark-task
    @Test
    void markTask_withValidId_updatesTaskAsCompleted() throws Exception {
        Long taskId = 1L;
        Task existing = new Task();
        existing.setId(taskId);
        existing.setTitle("Test Task");
        existing.setDescription("desc");
        existing.setCompleted(false);
        existing.setCreatedAt(Instant.now());

        when(taskRepo.findById(taskId)).thenReturn(Optional.of(existing));
        taskService.markTask(taskId);

        assertThat(existing.isCompleted()).isTrue();

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepo).save(captor.capture());
        Task saved = captor.getValue();
        assertThat(saved.isCompleted()).isTrue();
        assertThat(saved.getId()).isEqualTo(taskId);
        verify(taskRepo, times(1)).findById(taskId);
        verify(taskRepo, times(1)).save(any(Task.class));
    }

    @Test
    void markTask_withNullId_throwsIllegalArgumentException() {
        assertThatThrownBy(() -> taskService.markTask(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Task id must not be null.");

        verify(taskRepo, never()).findById(any());
        verify(taskRepo, never()).save(any());
    }

    @Test
    void markTask_withNonExistingId_throwsTaskNotFoundException() {
        Long missingId = 99L;
        when(taskRepo.findById(missingId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.markTask(missingId))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessageContaining("Task not found.");

        verify(taskRepo, times(1)).findById(missingId);
        verify(taskRepo, never()).save(any());
    }

    // get-recent-tasks
    @Test
    void getRecentTasks_returnsTop5UncompletedTasksOrderedByCreatedAtDesc() {
        Task task1 = new Task(1L, "A", "desc", Instant.now().minusSeconds(10), false);
        Task task2 = new Task(2L, "B", "desc", Instant.now(), false);
        List<Task> mockTasks = Arrays.asList(task2, task1); // descending order

        when(taskRepo.findTop5ByCompletedFalseOrderByCreatedAtDesc()).thenReturn(mockTasks);

        List<Task> result = taskService.getRecentTasks();

        assertThat(result).isNotNull().hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("B");
        assertThat(result.get(1).getTitle()).isEqualTo("A");

        verify(taskRepo, times(1)).findTop5ByCompletedFalseOrderByCreatedAtDesc();
    }

    @Test
    void getRecentTasks_whenNoTasks_returnsEmptyList() {
        when(taskRepo.findTop5ByCompletedFalseOrderByCreatedAtDesc()).thenReturn(Collections.emptyList());

        List<Task> result = taskService.getRecentTasks();

        assertThat(result).isEmpty();
        verify(taskRepo, times(1)).findTop5ByCompletedFalseOrderByCreatedAtDesc();
    }
}
