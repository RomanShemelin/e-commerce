import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from "react";

import cn from "classnames";

import cls from "./Modal.module.scss";

interface ModalProps {
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const ANIMATION_DELAY = 300;

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { children, isOpen, onClose } = props;

  const [isClosing, setIsClosing] = useState(false);
  const timeRef = useRef() as MutableRefObject<ReturnType<typeof setTimeout>>;

  const onCloseHandler = useCallback(() => {
    if (onClose) {
      setIsClosing(true);
      timeRef.current = setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, ANIMATION_DELAY);
    }
  }, [onClose]);

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseHandler();
      }
    },
    [onCloseHandler]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", onKeydown);
    }
    return () => {
      clearTimeout(timeRef.current);
      window.removeEventListener("keydown", onKeydown);
    };
  }, [isOpen, onKeydown]);

  return (
    <div
      className={cn(
        cls.Modal,
        { [cls.opened]: isOpen },
        { [cls.isClosing]: isClosing }
      )}
    >
      <div className={cls.overlay} onClick={onCloseHandler}>
        <div className={cls.content} onClick={onContentClick}>
          {children}
        </div>
      </div>
    </div>
  );
}
