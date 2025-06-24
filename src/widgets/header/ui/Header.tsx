"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { menuData } from "../menuData";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(menuData[0]);
  const router = useRouter();
  const pathname = usePathname();

  // url이 바뀔 때마다 selected 동기화
  useEffect(() => {
    const found = menuData.find((item) => item.path === pathname);
    if (found) setSelected(found);
  }, [pathname]);

  const handleSelect = (item: (typeof menuData)[0]) => {
    setSelected(item);
    setOpen(false);
    router.push(item.path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownBtn}
            onClick={() => setOpen((v) => !v)}
          >
            {selected.label}
            <span className={styles.arrow}>▼</span>
          </button>
          {open && (
            <ul className={styles.dropdownList}>
              {menuData.map((item) => (
                <li
                  key={item.path}
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};
