import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import RootResumeTerminal from './RootResumeTerminal';
import { vi, expect, it, describe, beforeEach } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock CodeEditor
vi.mock('./CodeEditor', () => ({
  default: () => <div data-testid="code-editor" />,
}));

// Mock EventSource
class MockEventSource {
  onmessage: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;
  addEventListener = vi.fn();
  close = vi.fn();
  constructor(public url: string) {}
}
global.EventSource = MockEventSource as any;

describe('RootResumeTerminal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.endsWith('/start')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sessionId: 'test-session-id' }),
        });
      }
      if (url.endsWith('/exec')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ output: 'Mock output', cwd: '/home/guest' }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }) as any;

    // Clear sessionStorage
    sessionStorage.clear();
  });

  it('boots and shows welcome message', async () => {
    render(<RootResumeTerminal />);
    
    // Should show booting message first
    expect(screen.getByText(/Booting RootResume OS/i)).toBeInTheDocument();
    
    // Wait for session initialization
    await waitFor(() => {
      expect(screen.getByText(/Welcome to RootResume OS/i)).toBeInTheDocument();
    });
    
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/start'), expect.any(Object));
  });

  it('handles help command', async () => {
    render(<RootResumeTerminal />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome to RootResume OS/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    
    // Type 'help' and press Enter
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Should show help lines
    await waitFor(() => {
      expect(screen.getByText(/Available Commands:/i)).toBeInTheDocument();
    });
  });

  it('submits a linux command to the server', async () => {
    render(<RootResumeTerminal />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome to RootResume OS/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    
    // Type 'ls' and press Enter
    fireEvent.change(input, { target: { value: 'ls' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Should call /exec
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/exec'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"code":"ls"'),
        })
      );
    });

    // Should show mock output
    await waitFor(() => {
      expect(screen.getByText('Mock output')).toBeInTheDocument();
    });
  });

  it('clears history with clear command', async () => {
    render(<RootResumeTerminal />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome to RootResume OS/i)).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    
    // Type 'clear' and press Enter
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Welcome message should be gone
    await waitFor(() => {
      expect(screen.queryByText(/Welcome to RootResume OS/i)).not.toBeInTheDocument();
    });
  });
});
