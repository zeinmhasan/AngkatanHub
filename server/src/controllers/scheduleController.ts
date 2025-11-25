import { Request, Response } from 'express';
import Schedule from '../models/Schedule';

// Get all schedule items, optionally filtered by class
export const getScheduleByClass = async (req: Request, res: Response) => {
  try {
    const { class: className } = req.query;
    
    let filter = {};
    if (className && className !== 'all') {
      filter = { className };
    }

    const schedule = await Schedule.find(filter).sort({ day: 1, startTime: 1 });
    
    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new schedule item
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { className, course, day, startTime, endTime, room, lecturer, notes } = req.body;
    const userId = (req as any).userId; // Get user ID from auth middleware

    const newSchedule = new Schedule({
      className,
      course,
      day,
      startTime,
      endTime,
      room,
      lecturer,
      notes,
      createdBy: userId || 'system'
    });

    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a schedule item
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { className, course, day, startTime, endTime, room, lecturer, notes } = req.body;

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { className, course, day, startTime, endTime, room, lecturer, notes },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a schedule item
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }

    res.status(200).json({ message: 'Schedule item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};