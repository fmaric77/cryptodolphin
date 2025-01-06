import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const cryptoSymbolParam = searchParams.get('cryptoSymbol');
  const cryptoSymbol = cryptoSymbolParam?.toUpperCase();

  // Validate the cryptocurrency symbol
  if (!cryptoSymbol || !/^[A-Z]{3,5}$/.test(cryptoSymbol)) {
    return NextResponse.json({ error: 'Invalid cryptocurrency symbol' }, { status: 400 });
  }

  // Resolve the path to the Python script
  const scriptPath = path.resolve(process.cwd(), 'app/components/predict.py');

  try {
    const { stdout } = await execAsync(`python3 ${scriptPath} ${cryptoSymbol}`);
    
    try {
      const data = JSON.parse(stdout);
      
      if (data.error) {
        return NextResponse.json({ error: data.error }, { status: 400 });
      }
      
      return NextResponse.json(data, { status: 200 });
    } catch (parseError) {
      console.error(`JSON parse error: ${parseError}`);
      return NextResponse.json(
        { error: 'Invalid JSON output from prediction script' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Execution error: ${error}`);
    return NextResponse.json(
      { error: 'Failed to execute prediction script' },
      { status: 500 }
    );
  }
}