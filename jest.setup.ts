import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error temporary fix for TextDecoder not being defined globally in Node.js
  global.TextDecoder = TextDecoder;
}
