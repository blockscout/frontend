export default function getDefaultTransitionProps(props?: { transitionProperty: string }) {
  return {
    transitionProperty: `background-color, color, border-color${ props?.transitionProperty ? ', ' + props.transitionProperty : '' }`,
    transitionDuration: 'normal',
    transitionTimingFunction: 'ease',
  };
}
