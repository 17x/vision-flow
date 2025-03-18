import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

type BasicProps = Partial<React.SVGAttributes<unknown>>

const basicProps: BasicProps = {
  // fill: '#9b9a9a',
  strokeWidth: "2",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

const ModifyColor = '#9b9a9a'

export const LayerUp: React.FC<IconProps> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path fill={ModifyColor} {...basicProps} d="M10.06,10.07L1,15.74l9.06,5.67,9.06-5.67-9.06-5.67Z"/>
    <path fill='#ffffff' {...basicProps}
          d="M7.64,7.04c-2.21,1.38-4.42,2.76-6.64,4.15,3.02,1.89,6.04,3.78,9.06,5.67l9.06-5.67c-2.24-1.4-4.48-2.8-6.72-4.2"/>
    <path {...basicProps}
          d="M10.03,1c.01,2.22.04,6.67.04,6.67M10.03,1c-1.87,1.12-3.75,2.25-5.62,3.37M10.06,1c2.09,1.3,3.4,2.13,5.55,3.47"/>
  </svg>
);

export const LayerDown: React.FC<IconProps> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path   {...basicProps}
            d="M12.49,15.36c2.21-1.38,4.42-2.76,6.64-4.15-3.02-1.89-6.04-3.78-9.06-5.67L1,11.22c2.24,1.4,4.48,2.8,6.72,4.2"/>
    <path {...basicProps}
          d="M10.1,21.4c0-2.26-.02-4.52-.03-6.77M10.1,21.4c1.87-1.12,3.75-2.25,5.62-3.37M10.06,21.4c-2.09-1.3-3.4-2.13-5.55-3.47"/>
    <path fill={ModifyColor} {...basicProps} d="M10.06,12.33l9.06-5.67L10.06,1,1,6.67l9.06,5.67Z"/>
  </svg>
);

export const LayerToTop: React.FC<IconProps> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path fill='#fff' {...basicProps}
          d="M10.65,10.66L1,16.69l9.65,6.03,9.65-6.03-9.65-6.03Z"/>
    <path fill='#fff'  {...basicProps}
          d="M10.65,5.85L1,11.88l9.65,6.03,9.65-6.03-9.65-6.03Z"/>
    <path fill={ModifyColor}  {...basicProps}
          d="M10.65,1L1,7.03l9.65,6.03,9.65-6.03L10.65,1Z"/>
  </svg>
);

export const LayerToBottom: React.FC<IconProps> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path fill={ModifyColor}  {...basicProps}
          d="M10.65,10.66L1,16.69l9.65,6.03,9.65-6.03-9.65-6.03Z"/>
    <path fill='#fff'  {...basicProps}
          d="M10.65,5.85L1,11.88l9.65,6.03,9.65-6.03-9.65-6.03Z"/>
    <path fill='#fff'  {...basicProps}
          d="M10.65,1L1,7.03l9.65,6.03,9.65-6.03L10.65,1Z"/>
  </svg>
);