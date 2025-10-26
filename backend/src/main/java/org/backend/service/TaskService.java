package org.backend.service;

import org.backend.dtos.TaskDto;
import org.backend.exception.CreateTaskFailedException;
import org.backend.exception.TaskNotFoundException;
import org.backend.model.Task;

import java.util.List;

public interface TaskService {
    Task createTask(TaskDto taskDto) throws CreateTaskFailedException;
    void markTask(Long id) throws TaskNotFoundException, IllegalArgumentException;
    List<Task> getRecentTasks();
}
