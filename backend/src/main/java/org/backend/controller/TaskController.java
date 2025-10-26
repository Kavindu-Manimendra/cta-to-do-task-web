package org.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.backend.dtos.APIResponseDto;
import org.backend.dtos.TaskDto;
import org.backend.exception.CreateTaskFailedException;
import org.backend.exception.TaskNotFoundException;
import org.backend.model.Task;
import org.backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<APIResponseDto> createTask(@RequestBody TaskDto taskDto) {
        log.info("Received request to create task with title: {}", taskDto.getTitle());
        APIResponseDto response = new APIResponseDto();
        try {
            Task task = taskService.createTask(taskDto);
            response.setMessage("Task has been successfully created.");
            response.setData(task);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (CreateTaskFailedException e) {
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.setMessage("An unexpected error occurred while saving the task. Please try again later.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/mark-task/{id}")
    public ResponseEntity<APIResponseDto> markTask(@PathVariable("id") String id) {
        log.info("Received request to mark task with id: {}", id);
        APIResponseDto response = new APIResponseDto();
        try {
            Long taskId = Long.parseLong(id);
            taskService.markTask(taskId);
            response.setMessage("Task has been successfully marked.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (TaskNotFoundException e) {
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            response.setMessage(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            response.setMessage("An unexpected error occurred while updating the task status.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-recent_tasks")
    public ResponseEntity<APIResponseDto> getRecentTasks() {
        log.info("Received request to get recent tasks");
        APIResponseDto response = new APIResponseDto();
        try {
            List<Task> tasks = taskService.getRecentTasks();
            response.setMessage("Tasks retrieved successfully.");
            response.setData(tasks);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("An unexpected error occurred while getting the recent tasks.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
