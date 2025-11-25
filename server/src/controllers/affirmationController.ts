import { Request, Response } from 'express';

// Get daily affirmation
export const getDailyAffirmation = async (_req: Request, res: Response) => {
  try {
    // In a real application, we would fetch from an API or database
    // For now, we'll return a random affirmation from a predefined list
    const affirmations = [
      "Konsistensi kecil membawa hasil besar",
      "Belajar hari ini untuk sukses besok",
      "Progress sekecil apapun tetap progress",
      "Semangat menjalani hari ini!",
      "Kamu mampu menggapai impianmu!",
      "Setiap usaha akan membuahkan hasil",
      "Jangan menyerah, kamu lebih kuat dari yang kamu kira",
      "Hari ini adalah hari yang indah untuk belajar",
      "Kesuksesan adalah hasil dari kerja keras yang konsisten",
      "Percayalah pada dirimu sendiri"
    ];
    
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const dailyAffirmation = affirmations[randomIndex];
    
    res.status(200).json({ affirmation: dailyAffirmation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};