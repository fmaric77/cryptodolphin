// app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cryptoSymbolParam = searchParams.get('cryptoSymbol');
  const cryptoSymbol = cryptoSymbolParam?.toUpperCase();

  // Validate the cryptocurrency symbol
  if (!cryptoSymbol || !/^[A-Z]{3,5}$/.test(cryptoSymbol)) {
    return NextResponse.json({ error: 'Invalid cryptocurrency symbol' }, { status: 400 });
  }

  // Resolve the path to the Python script
  const scriptPath = path.resolve(process.cwd(), 'app/components/predict.py');

  return new Promise((resolve) => {
    exec(`python3 ${scriptPath} ${cryptoSymbol}`, (error, stdout) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        resolve(
          NextResponse.json(
            { error: 'Failed to execute prediction script' },
            { status: 500 }
          )
        );
        return;
      }
      try {
        const data = JSON.parse(stdout);
        
        // Check if the Python script returned an error
        if (data.error) {
          resolve(
            NextResponse.json(
              { error: data.error },
              { status: 400 }
            )
          );
        } else {
          resolve(
            NextResponse.json(data, { status: 200 })
          );
        }
      } catch (parseError) {
        console.error(`JSON parse error: ${parseError}`);
        resolve(
          NextResponse.json(
            { error: 'Invalid JSON output from prediction script' },
            { status: 500 }
          )
        );
      }
    });
  });
}