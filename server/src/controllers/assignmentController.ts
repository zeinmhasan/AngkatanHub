import { Request, Response } from 'express';
import Assignment from '../models/Assignment';

// Get all assignments, optionally filtered by class and status
export const getAssignmentsByClass = async (req: Request, res: Response) => {
  try {
    const { class: className, status } = req.query;
    
    let filter: any = {};
    if (className && className !== 'all') {
      filter.className = className;
    }
    
    if (status === 'pending') {
      filter.completed = false;
    } else if (status === 'completed') {
      filter.completed = true;
    }

    const assignments = await Assignment.find(filter).sort({ dueDate: 1 });
    
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new assignment
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description, className, dueDate, priority, attachments } = req.body;
    const userId = (req as any).userId; // Get user ID from auth middleware

    const newAssignment = new Assignment({
      title,
      description,
      className,
      dueDate,
      priority: priority || 'medium',
      attachments: attachments || [],
      createdBy: userId || 'system'
    });

    await newAssignment.save();

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an assignment
export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, className, dueDate, priority, attachments } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, className, dueDate, priority, attachments },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark assignment as completed/incompleted
export const completeAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an assignment
export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};