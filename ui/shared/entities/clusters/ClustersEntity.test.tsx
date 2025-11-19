import React from 'react';

import { render, screen } from 'jest/lib';

import ClustersEntity from './ClustersEntity';

describe('ClustersEntity', () => {
  const mockClusterName = 'test-cluster';

  it('should render cluster name with slash', () => {
    render(<ClustersEntity clusterName={ mockClusterName }/>);

    expect(screen.getByText('test-cluster/')).toBeTruthy();
  });

  it('should render cluster icon', () => {
    render(<ClustersEntity clusterName={ mockClusterName }/>);

    const icon = screen.getByAltText('test-cluster profile');
    expect(icon).toBeTruthy();
  });

  it('should link to cluster details page', () => {
    render(<ClustersEntity clusterName={ mockClusterName }/>);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/name-services/clusters/test-cluster');
  });

  it('should render without link when noLink is true', () => {
    render(<ClustersEntity clusterName={ mockClusterName } noLink/>);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('test-cluster/')).toBeTruthy();
  });

  it('should show loading skeleton when loading', () => {
    render(<ClustersEntity clusterName={ mockClusterName } isLoading/>);

    const skeletons = document.querySelectorAll('.chakra-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
