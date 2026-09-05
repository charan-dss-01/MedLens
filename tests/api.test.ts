import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// API Mocking test suite for Gemini Medical Extraction API
describe('Gemini API & Extraction Route Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('handles successful report extraction payload', async () => {
    const mockApiResponse = {
      success: true,
      data: {
        report: { id: 'rep-101', fileName: 'Blood_Test.pdf' },
        results: [
          {
            testName: 'Hemoglobin',
            value: '13.4',
            unit: 'g/dL',
            referenceRange: '12.0 - 15.5 g/dL',
            status: 'WITHIN_PROVIDED_RANGE',
          },
        ],
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    });
    global.fetch = mockFetch;

    const response = await fetch('/api/reports/upload', {
      method: 'POST',
      body: new FormData(),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.results[0].testName).toBe('Hemoglobin');
  });

  it('handles rate-limiting HTTP 429 response gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Gemini API rate limit reached. Please retry in 30 seconds.',
      }),
    });
    global.fetch = mockFetch;

    const response = await fetch('/api/reports/upload', {
      method: 'POST',
      body: new FormData(),
    });
    const json = await response.json();

    expect(response.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error).toBe('RATE_LIMIT_EXCEEDED');
  });

  it('handles API timeout or server 500 error gracefully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        error: 'SERVER_ERROR',
        message: 'Failed to process report due to upstream timeout.',
      }),
    });
    global.fetch = mockFetch;

    const response = await fetch('/api/reports/upload', {
      method: 'POST',
      body: new FormData(),
    });
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe('SERVER_ERROR');
  });

  it('handles network disconnection exception', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network request failed'));
    global.fetch = mockFetch;

    await expect(
      fetch('/api/reports/upload', { method: 'POST', body: new FormData() })
    ).rejects.toThrow('Network request failed');
  });
});
