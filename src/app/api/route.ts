import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import path from "path";
import fs from 'fs'

export async function GET() {
  const filePath = path.resolve('.', 'public/YenUSCV.pdf')
  const pdfBuffer = fs.readFileSync(filePath)

  return new Response(pdfBuffer, {
    status: 200,
    headers: { 'Content-Disposition': "attachment; filename=YenUSCV.pdf", 'Content-Type': 'application/pdf' },
  });
}
