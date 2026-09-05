import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, VerificationBadge } from '@/components/StatusBadge';
import ProvenanceBadge from '@/components/ProvenanceBadge';

describe('WCAG 2.1 AAA Accessibility & ARIA Assertion Tests', () => {
  it('StatusBadge renders correct role="status" and screen-reader aria-label', () => {
    render(<StatusBadge status="WITHIN_PROVIDED_RANGE" />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Reference Range Status: Within Range');
    expect(badge).toHaveTextContent('Within Range');
  });

  it('StatusBadge handles out-of-range status with proper ARIA attributes', () => {
    render(<StatusBadge status="ABOVE_PROVIDED_RANGE" />);

    const badge = screen.getByRole('status');
    expect(badge).toHaveAttribute('aria-label', 'Reference Range Status: Above Range');
    expect(badge).toHaveTextContent('Above Range');
  });

  it('VerificationBadge renders correct role="status" and ARIA label for PENDING state', () => {
    render(<VerificationBadge status="PENDING" />);

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Verification Governance Status: Pending Review');
    expect(badge).toHaveTextContent('Pending');
  });

  it('ProvenanceBadge renders role="status" and detailed provenance text', () => {
    render(
      <ProvenanceBadge 
        type="DOCUMENT_EXTRACTED" 
        source={{ fileName: 'Lab_Report.pdf', pageNumber: 2, textSnippet: 'WBC 9.4' }} 
      />
    );

    const badge = screen.getByRole('status');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Data Provenance: Document Extracted from Lab_Report.pdf Page 2');
    expect(badge).toHaveTextContent('Lab_Report.pdf · Page 2');
  });
});
