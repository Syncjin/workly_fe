"use client";

import React, { createContext, forwardRef, useContext } from "react";

import { cx } from "../../theme/classes";

import * as styles from "./Header.css";

// Context 타입 정의
interface HeaderContextValue {
  unstyled: boolean;
}

// Context 생성
const HeaderContext = createContext<HeaderContextValue | null>(null);

// Context 사용을 위한 커스텀 훅
const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("Header 하위 컴포넌트가 Header Context 외부에서 사용되었습니다. Header 컴포넌트 내부에서만 사용해주세요.");
    }
    throw new Error("Header 하위 컴포넌트는 Header 내부에서만 사용할 수 있습니다.");
  }
  return context;
};

// HeaderRoot 컴포넌트 Props 타입 정의
interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  unstyled?: boolean;
  as?: React.ElementType;
}

// HeaderRoot 컴포넌트 구현
const HeaderRoot = forwardRef<HTMLElement, HeaderProps>(({ children, className, unstyled = false, as: Component = "header", ...props }, ref) => {
  const baseClassName = unstyled ? undefined : styles.header;
  const combinedClassName = cx(baseClassName, className);

  return (
    <HeaderContext.Provider value={{ unstyled }}>
      <Component ref={ref} className={combinedClassName} role="banner" {...props}>
        {children}
      </Component>
    </HeaderContext.Provider>
  );
});

HeaderRoot.displayName = "Header";

// 섹션 컴포넌트들의 Props 타입 정의
interface HeaderSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

// Header.Left 컴포넌트
const HeaderLeft = forwardRef<HTMLDivElement, HeaderSectionProps>(({ children, className, "aria-label": ariaLabel = "헤더 왼쪽 영역", ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.leftSection;
  const combinedClassName = cx(baseClassName, className);

  return (
    <div ref={ref} className={combinedClassName} role="region" aria-label={ariaLabel} {...props}>
      {children}
    </div>
  );
});

HeaderLeft.displayName = "Header.Left";

// Header.Center 컴포넌트
const HeaderCenter = forwardRef<HTMLDivElement, HeaderSectionProps>(({ children, className, "aria-label": ariaLabel = "헤더 중앙 영역", ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.centerSection;
  const combinedClassName = cx(baseClassName, className);

  return (
    <div ref={ref} className={combinedClassName} role="region" aria-label={ariaLabel} {...props}>
      {children}
    </div>
  );
});

HeaderCenter.displayName = "Header.Center";

// Header.Right 컴포넌트
const HeaderRight = forwardRef<HTMLDivElement, HeaderSectionProps>(({ children, className, "aria-label": ariaLabel = "헤더 오른쪽 영역", ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.rightSection;
  const combinedClassName = cx(baseClassName, className);

  return (
    <div ref={ref} className={combinedClassName} role="region" aria-label={ariaLabel} {...props}>
      {children}
    </div>
  );
});

HeaderRight.displayName = "Header.Right";

// Header.MenuButton 컴포넌트 Props 타입 정의
interface HeaderMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-describedby"?: string;
  children?: React.ReactNode;
}

// Header.MenuButton 컴포넌트
const HeaderMenuButton = forwardRef<HTMLButtonElement, HeaderMenuButtonProps>(({ "aria-label": ariaLabel = "메뉴", "aria-expanded": ariaExpanded, "aria-controls": ariaControls, children, className, onKeyDown, ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.menuButton;
  const combinedClassName = cx(baseClassName, className);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter 또는 Space 키로 버튼 활성화
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }

    // 사용자 정의 onKeyDown 핸들러 호출
    onKeyDown?.(event);
  };

  return (
    <button ref={ref} type="button" className={combinedClassName} aria-label={ariaLabel} aria-expanded={ariaExpanded} aria-controls={ariaControls} onKeyDown={handleKeyDown} {...props}>
      {children}
    </button>
  );
});

HeaderMenuButton.displayName = "Header.MenuButton";

// Header.Logo 컴포넌트 Props 타입 정의
interface HeaderLogoProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  href?: string;
  as?: React.ElementType;
}

// Header.Logo 컴포넌트
const HeaderLogo = forwardRef<HTMLElement, HeaderLogoProps>(({ children, href, as, className, onKeyDown, onClick, ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.logo;
  const combinedClassName = cx(baseClassName, className);

  // href가 있으면 링크로, as prop이 있으면 해당 컴포넌트로, 기본은 div
  let Component: React.ElementType = as || "div";

  if (href && !as) {
    Component = "a";
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // 클릭 가능한 요소(링크나 버튼)에서 Enter 키 처리
    if ((Component === "a" || Component === "button" || onClick) && event.key === "Enter") {
      event.preventDefault();
      if (onClick) {
        onClick(event as unknown as React.MouseEvent<HTMLElement, MouseEvent>);
      } else if (Component === "a" && href) {
        // 링크의 경우 기본 동작 허용
        return;
      }
    }

    // 사용자 정의 onKeyDown 핸들러 호출
    onKeyDown?.(event);
  };

  const componentProps = {
    ...(href ? { href } : {}),
    ...(onClick || (Component === "a" && href) ? { onKeyDown: handleKeyDown } : {}),
    ...(onClick ? { onClick } : {}),
    // 로고에 적절한 ARIA 속성 추가
    ...(Component === "a" && href ? { "aria-label": "홈으로 이동" } : {}),
    ...props,
  };

  return (
    <Component ref={ref} className={combinedClassName} {...componentProps}>
      {children}
    </Component>
  );
});

HeaderLogo.displayName = "Header.Logo";

// Header.IconButton 컴포넌트 Props 타입 정의
interface HeaderIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string; // 필수
  "aria-describedby"?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

// Header.IconButton 컴포넌트
const HeaderIconButton = forwardRef<HTMLButtonElement, HeaderIconButtonProps>(({ "aria-label": ariaLabel, icon, badge, className, onKeyDown, ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.iconButton;
  const combinedClassName = cx(baseClassName, className);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter 또는 Space 키로 버튼 활성화
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }

    // 사용자 정의 onKeyDown 핸들러 호출
    onKeyDown?.(event);
  };

  return (
    <button ref={ref} type="button" className={combinedClassName} aria-label={ariaLabel} aria-describedby={badge ? `${ariaLabel}-badge` : undefined} onKeyDown={handleKeyDown} {...props}>
      {icon}
      {badge && (
        <span id={`${ariaLabel}-badge`} className={unstyled ? undefined : styles.badge} aria-label="알림" role="status">
          {badge}
        </span>
      )}
    </button>
  );
});

HeaderIconButton.displayName = "Header.IconButton";

// Header.Avatar 컴포넌트 Props 타입 정의
interface HeaderAvatarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

// Header.Avatar 컴포넌트
const HeaderAvatar = forwardRef<HTMLElement, HeaderAvatarProps>(({ children, as: Component = "div", className, onKeyDown, onClick, ...props }, ref) => {
  const { unstyled } = useHeaderContext();
  const baseClassName = unstyled ? undefined : styles.avatar;
  const combinedClassName = cx(baseClassName, className);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // 클릭 가능한 요소에서 Enter 또는 Space 키 처리
    if ((Component === "button" || onClick) && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      if (onClick) {
        onClick(event as unknown as React.MouseEvent<HTMLElement, MouseEvent>);
      }
    }

    // 사용자 정의 onKeyDown 핸들러 호출
    onKeyDown?.(event);
  };

  const componentProps = {
    ...(onClick ? { onClick, onKeyDown: handleKeyDown } : {}),
    // 클릭 가능한 아바타에 적절한 ARIA 속성 추가
    ...(onClick
      ? {
          role: Component === "button" ? "button" : "button",
          "aria-label": "사용자 메뉴",
          tabIndex: 0,
        }
      : {}),
    ...props,
  };

  return (
    <Component ref={ref} className={combinedClassName} {...componentProps}>
      {children}
    </Component>
  );
});

HeaderAvatar.displayName = "Header.Avatar";

// 합성 패턴으로 Header 컴포넌트 구성
export const Header = Object.assign(HeaderRoot, {
  Left: HeaderLeft,
  Center: HeaderCenter,
  Right: HeaderRight,
  MenuButton: HeaderMenuButton,
  Logo: HeaderLogo,
  IconButton: HeaderIconButton,
  Avatar: HeaderAvatar,
});

// 훅과 타입 export
export { useHeaderContext };
export type { HeaderAvatarProps, HeaderContextValue, HeaderIconButtonProps, HeaderLogoProps, HeaderMenuButtonProps, HeaderProps, HeaderSectionProps };
