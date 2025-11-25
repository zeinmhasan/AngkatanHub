import { Request, Response } from 'express';
import ExternalInfo from '../models/ExternalInfo';

// Get all external info, optionally filtered by category
export const getExternalInfoByCategory = async (req: Request, res: Response) => {
  try {
    const { category, date } = req.query;
    
    let filter: any = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (date === 'upcoming' && filter.hasOwnProperty('deadline')) {
      filter.deadline = { ...filter.deadline, $gte: new Date() };
    } else if (date === 'past' && filter.hasOwnProperty('deadline')) {
      filter.deadline = { ...filter.deadline, $lt: new Date() };
    } else if (date === 'upcoming') {
      filter.deadline = { $gte: new Date() };
    } else if (date === 'past') {
      filter.deadline = { $lt: new Date() };
    }

    const externalInfo = await ExternalInfo.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(externalInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new external info item
export const createExternalInfo = async (req: Request, res: Response) => {
  try {
    const { title, description, category, deadline, organizer, link } = req.body;
    const userId = (req as any).userId; // Get user ID from auth middleware

    const newExternalInfo = new ExternalInfo({
      title,
      description,
      category,
      deadline,
      organizer,
      link,
      postedBy: userId || 'system'
    });

    await newExternalInfo.save();

    res.status(201).json(newExternalInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an external info item
export const updateExternalInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, deadline, organizer, link } = req.body;

    const updatedExternalInfo = await ExternalInfo.findByIdAndUpdate(
      id,
      { title, description, category, deadline, organizer, link },
      { new: true }
    ).populate('postedBy', 'name email');

    if (!updatedExternalInfo) {
      return res.status(404).json({ message: 'External info not found' });
    }

    res.status(200).json(updatedExternalInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an external info item
export const deleteExternalInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedExternalInfo = await ExternalInfo.findByIdAndDelete(id);

    if (!deletedExternalInfo) {
      return res.status(404).json({ message: 'External info not found' });
    }

    res.status(200).json({ message: 'External info deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};