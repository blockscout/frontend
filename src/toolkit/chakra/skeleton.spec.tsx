// SPDX-License-Identifier: LicenseRef-Blockscout

// @vitest-environment jsdom

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from 'vitest/lib';

import { Skeleton } from './skeleton';

afterEach(cleanup);

describe('Skeleton', () => {
  describe('loading', () => {
    it('renders the chakra skeleton around its children', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton loading ref={ ref } data-testid="skeleton">content</Skeleton>);

      const element = screen.getByTestId('skeleton');
      expect(element.tagName).toBe('DIV');
      expect(element.hasAttribute('data-loading')).toBe(true);
      expect(element.classList.contains('chakra-skeleton')).toBe(true);
      expect(element.textContent).toBe('content');
      expect(ref.current).toBe(element);
    });
  });

  describe('not loading', () => {
    it('renders a plain div around its children', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton loading={ false } ref={ ref } className="outer" data-testid="skeleton">content</Skeleton>);

      const element = screen.getByTestId('skeleton');
      expect(element.tagName).toBe('DIV');
      expect(element.hasAttribute('data-loading')).toBe(false);
      expect(element.classList.contains('chakra-skeleton')).toBe(false);
      expect(element.classList.contains('outer')).toBe(true);
      expect(element.textContent).toBe('content');
      expect(ref.current).toBe(element);
    });

    it('treats an undefined loading flag as not loading', () => {
      render(<Skeleton loading={ undefined } data-testid="skeleton">content</Skeleton>);

      expect(screen.getByTestId('skeleton').hasAttribute('data-loading')).toBe(false);
    });

    it('wraps non-element children in a div even with asChild', () => {
      render(<Skeleton loading={ false } asChild data-testid="skeleton">content</Skeleton>);

      const element = screen.getByTestId('skeleton');
      expect(element.tagName).toBe('DIV');
      expect(element.textContent).toBe('content');
      expect(element.hasAttribute('asChild')).toBe(false);
    });
  });

  describe('not loading with asChild', () => {
    it('renders the child itself with no wrapper', () => {
      const { container } = render(
        <Skeleton loading={ false } asChild>
          <span data-testid="child">content</span>
        </Skeleton>,
      );

      const child = screen.getByTestId('child');
      expect(child.tagName).toBe('SPAN');
      expect(child.parentElement).toBe(container);
      expect(child.textContent).toBe('content');
    });

    it('lets its own props win over the child props', () => {
      render(
        <Skeleton loading={ false } asChild title="outer" aria-label="outer label">
          <span data-testid="child" title="inner" lang="en">content</span>
        </Skeleton>,
      );

      const child = screen.getByTestId('child');
      expect(child.getAttribute('title')).toBe('outer');
      expect(child.getAttribute('aria-label')).toBe('outer label');
      expect(child.getAttribute('lang')).toBe('en');
    });

    it('joins both class names, its own first', () => {
      render(
        <Skeleton loading={ false } asChild className="outer">
          <span data-testid="child" className="inner">content</span>
        </Skeleton>,
      );

      expect(screen.getByTestId('child').className).toBe('outer inner');
    });

    it('keeps the class name when only one side has it', () => {
      render(
        <>
          <Skeleton loading={ false } asChild className="outer">
            <span data-testid="without-class">content</span>
          </Skeleton>
          <Skeleton loading={ false } asChild>
            <span data-testid="with-class" className="inner">content</span>
          </Skeleton>
        </>,
      );

      expect(screen.getByTestId('without-class').className).toBe('outer');
      expect(screen.getByTestId('with-class').className).toBe('inner');
    });

    it('applies both css props, its own overriding the child on conflict', () => {
      render(
        <Skeleton loading={ false } asChild css={{ color: 'rgb(0, 0, 255)' }}>
          <chakra.span data-testid="child" css={{ color: 'rgb(255, 0, 0)', opacity: 0.5 }}>content</chakra.span>
        </Skeleton>,
      );

      const style = window.getComputedStyle(screen.getByTestId('child'));
      expect(style.color).toBe('rgb(0, 0, 255)');
      expect(style.opacity).toBe('0.5');
    });

    it('keeps the css prop when only one side has it', () => {
      render(
        <>
          <Skeleton loading={ false } asChild css={{ color: 'rgb(0, 0, 255)' }}>
            <chakra.span data-testid="without-css">content</chakra.span>
          </Skeleton>
          <Skeleton loading={ false } asChild>
            <chakra.span data-testid="with-css" css={{ color: 'rgb(255, 0, 0)' }}>content</chakra.span>
          </Skeleton>
        </>,
      );

      expect(window.getComputedStyle(screen.getByTestId('without-css')).color).toBe('rgb(0, 0, 255)');
      expect(window.getComputedStyle(screen.getByTestId('with-css')).color).toBe('rgb(255, 0, 0)');
    });

    it('passes the element to both its own ref and the child ref', () => {
      const ref = React.createRef<HTMLDivElement>();
      const childRef = React.createRef<HTMLSpanElement>();
      render(
        <Skeleton loading={ false } asChild ref={ ref }>
          <span data-testid="child" ref={ childRef }>content</span>
        </Skeleton>,
      );

      const child = screen.getByTestId('child');
      expect(ref.current).toBe(child);
      expect(childRef.current).toBe(child);
    });

    it('passes the element to its own ref when the child has none', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Skeleton loading={ false } asChild ref={ ref }>
          <span data-testid="child">content</span>
        </Skeleton>,
      );

      expect(ref.current).toBe(screen.getByTestId('child'));
    });

    it('keeps the child ref when it has no ref of its own', () => {
      const childRef = React.createRef<HTMLSpanElement>();
      render(
        <Skeleton loading={ false } asChild>
          <span data-testid="child" ref={ childRef }>content</span>
        </Skeleton>,
      );

      expect(childRef.current).toBe(screen.getByTestId('child'));
    });
  });
});
