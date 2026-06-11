import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
