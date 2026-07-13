"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

const CHEVRON_DOWN_PATH =
  "M11.5001 13.1714L16.4499 8.22168L17.8641 9.63589L11.5001 15.9999L5.13623 9.63589L6.55044 8.22168L11.5001 13.1714Z";
const CHEVRON_UP_PATH =
  "M11.5001 11.0503L16.4499 16L17.8641 14.5858L11.5001 8.22178L5.13623 14.5858L6.55044 16L11.5001 11.0503Z";

export type DropdownOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type DropdownProps = {
  options: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: ReactNode;
  className?: string;
  menuClassName?: string;
  "aria-label"?: string;
};

export function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = "",
  className,
  menuClassName,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  const openMenu = () => {
    const startIndex =
      selectedIndex >= 0
        ? selectedIndex
        : options.findIndex((option) => !option.disabled);
    setActiveIndex(startIndex);
    setIsOpen(true);
  };

  const closeMenu = (focusTrigger = true) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const selectIndex = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    closeMenu();
  };

  const moveActive = (delta: number) => {
    if (options.length === 0) return;
    let next = activeIndex;
    for (let i = 0; i < options.length; i += 1) {
      next = (next + delta + options.length) % options.length;
      if (!options[next]?.disabled) break;
    }
    setActiveIndex(next);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) moveActive(1);
      else openMenu();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) openMenu();
      else moveActive(-1);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(options.findIndex((option) => !option.disabled));
    } else if (event.key === "End") {
      event.preventDefault();
      for (let i = options.length - 1; i >= 0; i -= 1) {
        if (!options[i].disabled) {
          setActiveIndex(i);
          break;
        }
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectIndex(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    } else if (event.key === "Tab") {
      closeMenu(false);
    }
  };

  return (
    <div
      className={["relative inline-block", className].filter(Boolean).join(" ")}
      ref={containerRef}
    >
      <button
        aria-controls={isOpen ? listId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="flex items-center rounded-lg bg-bg-default py-(--padding-3) pr-(--padding-2) pl-(--padding-3) text-body-xsmall-pc text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span className="whitespace-nowrap">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          className="size-(--icon-size-24) shrink-0 text-icon-secondary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d={isOpen ? CHEVRON_UP_PATH : CHEVRON_DOWN_PATH} fill="currentColor" />
        </svg>
      </button>
      {isOpen ? (
        <ul
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          aria-label={ariaLabel}
          className={[
            "absolute top-[calc(100%+2px)] z-10 flex min-w-[160px] flex-col overflow-hidden rounded-lg border border-border-default bg-bg-default shadow-[0_0_8px_0_var(--color-alpha-black-5)] focus-visible:outline-none",
            menuClassName ?? "left-0",
          ]
            .filter(Boolean)
            .join(" ")}
          id={listId}
          onKeyDown={handleListKeyDown}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                aria-disabled={option.disabled || undefined}
                aria-selected={isSelected}
                className={[
                  "flex items-center whitespace-nowrap p-(--padding-3) text-body-xxsmall-pc",
                  option.disabled
                    ? "cursor-not-allowed text-text-disabled"
                    : isSelected
                      ? "cursor-pointer text-text-primary"
                      : "cursor-pointer text-text-secondary",
                  isActive && !option.disabled ? "bg-bg-surface" : "bg-bg-default",
                ]
                  .filter(Boolean)
                  .join(" ")}
                id={`${listId}-${index}`}
                key={option.value}
                onClick={() => selectIndex(index)}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                role="option"
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
