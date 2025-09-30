"use client";
import type { IconName } from "@workly/icons";
import React from "react";

type ColorVariant = string; // TODO: Import from shared styles

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: { width: number; height: number } | number;
  color?: string | ColorVariant;
}

function isColorVariant(color?: string): color is ColorVariant {
  return !!color && /^([a-z\-]+)-(25|50|100|200|300|400|500|600|700|800|900)$/.test(color);
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  color = "currentColor", 
  className,
  style,
  ...props 
}) => {
  // size 처리
  const iconSize = typeof size === 'number' ? size : Math.max(size.width, size.height);
  
  // color가 ColorVariant면 CSS 변수로 변환
  const fillColor = isColorVariant(color) ? `var(--color-${color})` : color;

  // Dynamic import를 사용하여 SVG 컴포넌트 로드
  const [SvgComponent, setSvgComponent] = React.useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    
    const loadSvg = async () => {
      try {
        // @workly/icons/svgs에서 SVG 파일을 동적으로 import
        const svgModule = await import(`@workly/icons/svgs/${name}.svg`);
        if (mounted) {
          setSvgComponent(() => svgModule.default);
          setLoading(false);
        }
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`, error);
        if (mounted) {
          setSvgComponent(null);
          setLoading(false);
        }
      }
    };

    loadSvg();
    
    return () => {
      mounted = false;
    };
  }, [name]);

  if (loading) {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={fillColor}
        className={className}
        style={{ display: "inline-block", ...style }}
        {...props}
      >
        <rect width="24" height="24" fill="none" />
      </svg>
    );
  }

  if (!SvgComponent) {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={fillColor}
        className={className}
        style={{ display: "inline-block", ...style }}
        {...props}
      >
        <rect width="24" height="24" fill="none" />
        <text x="12" y="12" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="currentColor">
          ?
        </text>
      </svg>
    );
  }

  return (
    <SvgComponent
      width={iconSize}
      height={iconSize}
      fill={fillColor}
      className={className}
      style={{ display: "inline-block", ...style }}
      {...props}
    />
  );
};

export default Icon;