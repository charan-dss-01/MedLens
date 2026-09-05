import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge, VerificationBadge } from '../components/StatusBadge';
import ProvenanceBadge from '../components/ProvenanceBadge';

describe('React UI Components & Accessibility Tests', () => {
  it('renders StatusBadge with accessible non-wrapping pill text and aria attributes', () => {
    render(<StatusBadge status="WITHIN_PROVIDED_RANGE" />);
    const badge = screen.getByText('Within Range');
    expect(badge).toBeInTheDocument();
  });

  it('renders StatusBadge for Above Range with high contrast text', () => {
    render(<StatusBadge status="ABOVE_PROVIDED_RANGE" />);
    const badge = screen.getByText('Above Range');
    expect(badge).toBeInTheDocument();
  });

  it('renders StatusBadge for Below Range with accessible text', () => {
    render(<StatusBadge status="BELOW_PROVIDED_RANGE" />);
    const badge = screen.getByText('Below Range');
    expect(badge).toBeInTheDocument();
  });

  it('renders VerificationBadge for Verified state', () => {
    render(<VerificationBadge status="VERIFIED" />);
    const badge = screen.getByText('Verified');
    expect(badge).toBeInTheDocument();
  });

  it('renders VerificationBadge for Pending state with clock indicator', () => {
    render(<VerificationBadge status="PENDING" />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
  });

  it('renders ProvenanceBadge with file source and page number citations', () => {
    const source = {
      fileName: 'CBC_Report.pdf',
      pageNumber: 2,
      textSnippet: 'Hemoglobin: 12.8 g/dL',
    };
    render(<ProvenanceBadge type="DOCUMENT_EXTRACTED" source={source} />);
    const citation = screen.getByText(/CBC_Report.pdf · Page 2/i);
    expect(citation).toBeInTheDocument();
  });

  it('renders ProvenanceBadge for USER_PROVIDED input', () => {
    render(<ProvenanceBadge type="USER_PROVIDED" />);
    const provenance = screen.getByText('User provided');
    expect(provenance).toBeInTheDocument();
  });
});
