import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { useI18n } from '@/context/I18nContext';

const TaskList = ({
  tasks,
  projects,
  personnel,
  onEditTask,
  onDeleteTask,
  onTaskStatusChange,
}) => {
  const { t } = useI18n();

  if (tasks.length === 0) {
    return null; // Placeholder message handled by parent for context (no project vs no tasks)
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <AnimatePresence>
        {tasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          const assignedUser = personnel.find(p => p.id === task.assignedTo);
          return (
            <TaskCard
              key={task.id}
              task={task}
              project={project}
              assignedUser={assignedUser}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onTaskStatusChange}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;