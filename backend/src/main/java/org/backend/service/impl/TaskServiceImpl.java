package org.backend.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.backend.exception.CreateTaskFailedException;
import org.backend.exception.TaskNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.backend.dtos.TaskDto;
import org.backend.model.Task;
import org.backend.repo.TaskRepo;
import org.backend.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {
    private final TaskRepo taskRepo;

    @Override
    @Transactional
    public Task createTask(TaskDto taskDto) throws CreateTaskFailedException {
        log.info("createTask service...");
        try {
            if (taskDto == null) {
                throw new CreateTaskFailedException("Task data must not be null.");
            }
            if (taskDto.getTitle() == null || taskDto.getTitle().trim().isEmpty()) {
                throw new CreateTaskFailedException("Task title must not be empty.");
            }

            Task task = new Task();
            task.setTitle(taskDto.getTitle());
            task.setDescription(taskDto.getDescription());
            return taskRepo.save(task);
        } catch (CreateTaskFailedException e) {
            log.error("Failed to create task: ", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void markTask(Long id) throws TaskNotFoundException, IllegalArgumentException {
        log.info("markTask service...");
        try {
            if (id == null) {
                throw new IllegalArgumentException("Task id must not be null.");
            }
            Task task = taskRepo.findById(id)
                    .orElseThrow(() -> new TaskNotFoundException("Task not found."));

            if (task.isCompleted()) {
                log.info("Task with id {} is already marked as completed.", id);
                return;
            }
            task.setCompleted(true);
            taskRepo.save(task);
        } catch (TaskNotFoundException | IllegalArgumentException e) {
            log.error("Failed to mark task: ", e);
            throw e;
        }
    }

    @Override
    public List<Task> getRecentTasks() {
        log.info("getRecentTasks service...");
        return taskRepo.findTop5ByCompletedFalseOrderByCreatedAtDesc();
    }
}
