import { describe, it, expect } from 'vitest';
import { getAsset } from '../assets';

describe('getAsset', () => {
  it('returns an SVG element for success', () => {
    const icon = getAsset('success');
    expect(icon).not.toBeNull();
    expect(icon?.type).toBe('svg');
  });

  it('returns an SVG element for danger', () => {
    const icon = getAsset('danger');
    expect(icon).not.toBeNull();
    expect(icon?.type).toBe('svg');
  });

  it('returns an SVG element for warning', () => {
    const icon = getAsset('warning');
    expect(icon).not.toBeNull();
    expect(icon?.type).toBe('svg');
  });

  it('returns an SVG element for info', () => {
    const icon = getAsset('info');
    expect(icon).not.toBeNull();
    expect(icon?.type).toBe('svg');
  });

  it('returns null for default variant', () => {
    const icon = getAsset('default');
    expect(icon).toBeNull();
  });
});
