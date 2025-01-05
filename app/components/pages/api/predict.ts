// pages/api/predict.ts
import { exec } from 'child_process';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cryptoSymbolParam = req.query.cryptoSymbol;
  const cryptoSymbol = Array.isArray(cryptoSymbolParam) 
    ? cryptoSymbolParam[0].toUpperCase() 
    : cryptoSymbolParam?.toUpperCase();

  if (!cryptoSymbol || typeof cryptoSymbol !== 'string' || !/^[A-Z]{3,5}$/.test(cryptoSymbol)) {
    res.status(400).json({ error: 'Invalid cryptocurrency symbol' });
    return;
  }

  const scriptPath = path.resolve(process.cwd(), 'app/components/predict.py');

  exec(`python3 ${scriptPath} ${cryptoSymbol}`, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: 'Failed to execute prediction script' });
      return;
    }
    res.status(200).json(JSON.parse(stdout));
  });
}