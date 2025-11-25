import { Request, Response } from 'express';
import Activity from '../models/Activity';

// Get all activities
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const { type, date } = req.query;
    
    let filter: any = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (date === 'upcoming') {
      filter.date = { $gte: new Date() };
    } else if (date === 'past') {
      filter.date = { $lt: new Date() };
    }

    const activities = await Activity.find(filter).sort({ date: 1 });
    
    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new activity
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, organizer, maxParticipants, type } = req.body;
    const userId = (req as any).userId; // Get user ID from auth middleware

    const newActivity = new Activity({
      title,
      description,
      date,
      location,
      organizer,
      maxParticipants,
      type,
      createdBy: userId || 'system'
    });

    await newActivity.save();

    res.status(201).json(newActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an activity
export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, organizer, maxParticipants, type } = req.body;

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { title, description, date, location, organizer, maxParticipants, type },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an activity
export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register for an activity
export const registerForActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || 'testUser'; // In real app, this comes from auth middleware

    const activity = await Activity.findById(id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if user is already registered
    if (activity.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already registered for this activity' });
    }

    // Check if activity is full
    if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: 'Activity is full' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { $push: { participants: userId } },
      { new: true }
    );

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};