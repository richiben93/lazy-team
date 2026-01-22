import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('GPX Data Generation', () => {
  it('should have generated trips.json', () => {
    const filePath = path.join(process.cwd(), 'content', '.generated', 'trips.json');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const trips = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(trips.length).toBeGreaterThan(0);
  });

  it('should have generated members.json', () => {
    const filePath = path.join(process.cwd(), 'content', '.generated', 'members.json');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const members = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(members.length).toBe(3);
  });
});
