export const keyframes = {
  fromLeftToRight: {
    from: {
      left: '0%',
      transform: 'translateX(0%)',
    },
    to: {
      left: '100%',
      transform: 'translateX(-100%)',
    },
  },
  skeletonShimmer: {
    from: {
      transform: 'translate3d(-100%, 0, 0)',
    },
    to: {
      transform: 'translate3d(100%, 0, 0)',
    },
  },
};
