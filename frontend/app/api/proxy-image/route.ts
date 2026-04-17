import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  
  return new NextResponse(arrayBuffer, {
    headers: { 'Content-Type': blob.type || 'image/jpeg' },
  });
}