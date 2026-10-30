(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const menuToggle = document.querySelector("#menu-toggle");
  const primaryMenu = document.querySelector("#primary-menu");
  const modalBackdrop = document.querySelector("#project-modal");
  const modal = modalBackdrop.querySelector(".project-modal");
  const modalTitle = document.querySelector("#modal-title");
  const modalKicker = document.querySelector("#modal-kicker");
  const modalContent = document.querySelector("#modal-content");
  const closeModalButton = document.querySelector(".modal-close");
  let lastFocusedElement = null;

  const projectDetails = {
    event: {
      title: "게임 이벤트 & 보상 수령 허브",
      kicker: "Concept 01 · performance / platform",
      blocks: [
        {
          label: "Situation",
          text: "이벤트 오픈 시 트래픽이 집중되고, 초기 화면 로딩과 이벤트 탐색 과정이 길어질 수 있다는 가상의 상황을 둡니다."
        },
        {
          label: "Task",
          text: "사용자가 이벤트 정보를 빠르게 확인하고 보상을 수령하도록 진입 흐름을 정리하며, 피크 트래픽을 고려한 화면 구조를 제안합니다."
        },
        {
          label: "Action",
          text: "SSR/SSG 혼합 아키텍처, 이미지·스크립트 로딩 우선순위, React Query 서버 상태 캐싱 등을 검토하는 예시입니다. 실제 적용 기술은 수행 이력에 맞게 수정해야 합니다."
        },
        {
          label: "Result · 예시 수치",
          text: "브리프에 제시된 가정치: LCP 4.2초 → 1.2초, 동시 접속 5만 명 대응, Lighthouse 95점 이상. 검증되지 않은 예시 수치이며, 실제 측정 결과와 테스트 조건으로 교체해야 합니다."
        }
      ]
    },
    cafe: {
      title: "My Optimal Cafe UI",
      kicker: "Concept 02 · interaction / product UX",
      blocks: [
        {
          label: "Situation",
          text: "메뉴와 옵션이 많아질수록 조합 결과를 예상하기 어렵고, 주문 전에 사용자가 선택을 반복할 수 있다는 가상의 문제를 정의합니다."
        },
        {
          label: "Task",
          text: "사용자가 메뉴를 조합하면서 결과를 이해하고 빠르게 수정할 수 있는 인터랙티브 시뮬레이터를 설계하는 것이 목표입니다."
        },
        {
          label: "Action",
          text: "드래그 앤 드롭 메뉴 구성, 즉시 갱신되는 선택 요약, Canvas 기반 3D 미리보기를 연결하는 예시입니다. 실제 제품 동작과 기술 선택은 검증 후 수정해 주세요."
        },
        {
          label: "Result · 검증 항목",
          text: "조합 완료율, 옵션 변경 횟수, 태스크 완료 시간과 키보드 접근성을 비교하는 검증 계획 예시입니다. 실제 성과를 의미하지 않습니다."
        }
      ]
    }
  };

  function safelyReadTheme() {
    try {
      return localStorage.getItem("portfolio-theme");
    } catch {
      return null;
    }
  }

  function safelyStoreTheme(theme) {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Theme switching remains functional when storage is unavailable.
    }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
    themeToggle.setAttribute("title", isDark ? "라이트 모드" : "다크 모드");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor.setAttribute("content", isDark ? "#161920" : "#f4f1e7");
  }

  applyTheme(safelyReadTheme() === "dark" ? "dark" : "light");
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    safelyStoreTheme(nextTheme);
  });

  function closeMenu() {
    primaryMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    primaryMenu.classList.toggle("is-open", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
    if (!isOpen) primaryMenu.querySelector("a").focus();
  });

  primaryMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      if (!modalBackdrop.hidden) closeModal();
    }
  });

  function renderProject(projectKey) {
    const project = projectDetails[projectKey];
    if (!project) return;
    modalTitle.textContent = project.title;
    modalKicker.textContent = project.kicker;
    modalContent.replaceChildren();
    project.blocks.forEach((block) => {
      const article = document.createElement("article");
      article.className = "star-block";
      const heading = document.createElement("h3");
      heading.textContent = block.label;
      const paragraph = document.createElement("p");
      paragraph.textContent = block.text;
      article.append(heading, paragraph);
      modalContent.append(article);
    });
  }

  function openModal(projectKey, trigger) {
    renderProject(projectKey);
    lastFocusedElement = trigger;
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      modalBackdrop.classList.add("is-open");
      closeModalButton.focus();
    });
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      modalBackdrop.hidden = true;
      if (lastFocusedElement) lastFocusedElement.focus();
    }, 210);
  }

  document.querySelectorAll(".project-open").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.project, button));
  });
  closeModalButton.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const filterButtons = [...document.querySelectorAll(".filter-tab")];
  const skillItems = [...document.querySelectorAll(".skill-item")];
  const skillStatus = document.querySelector("#skills-status");
  const filterNames = {
    all: "전체 기술 키워드",
    frontend: "프론트엔드 기술",
    state: "상태 관리 기술",
    performance: "성능·도구 기술"
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
      skillItems.forEach((item) => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
      skillStatus.textContent = `${filterNames[filter]} 표시 · 기술 숙련도 검증 전`;
    });
  });

  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    observedSections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

})();
