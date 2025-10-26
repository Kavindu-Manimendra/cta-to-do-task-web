package org.backend.repo;

import org.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepo  extends JpaRepository<Task, Long> {

    // SELECT * FROM task WHERE completed = false ORDER BY created_at DESC LIMIT 5;
    List<Task> findTop5ByCompletedFalseOrderByCreatedAtDesc();
}
