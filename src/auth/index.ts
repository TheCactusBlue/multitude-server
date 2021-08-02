import {verify} from "jsonwebtoken";

function extractHeader(header: string) {
  if (header.startsWith("Bearer ")){
    return header.substring(7, header.length);
  }
  return '';
}

export function verifyHeader(header: string) {
  const token = extractHeader(header);
  try {
    return verify(token, process.env.SECRET!);
  } catch (e) {
    console.log(e);
  }
  return null;
}