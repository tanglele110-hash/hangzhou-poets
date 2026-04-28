import { useEffect, useState } from 'react';

/**
 * 极简 hash 路由。支持：
 *   #/                  → home
 *   #/poet/<name>       → 打开诗人详情
 *   #/graph             → 全景关系图
 *   #/graph/<name>      → 单人关系图
 */
export type Route =
  | { kind: 'home' }
  | { kind: 'poet'; name: string }
  | { kind: 'graph' }
  | { kind: 'graphFor'; name: string };

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').trim();
  if (!raw) return { kind: 'home' };
  const parts = raw.split('/').map(decodeURIComponent);
  if (parts[0] === 'poet' && parts[1]) {
    return { kind: 'poet', name: parts[1] };
  }
  if (parts[0] === 'graph') {
    if (parts[1]) return { kind: 'graphFor', name: parts[1] };
    return { kind: 'graph' };
  }
  return { kind: 'home' };
}

export function buildHash(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '';
    case 'poet':
      return `#/poet/${encodeURIComponent(route.name)}`;
    case 'graph':
      return '#/graph';
    case 'graphFor':
      return `#/graph/${encodeURIComponent(route.name)}`;
  }
}

export function useHashRoute(): [Route, (next: Route) => void] {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(typeof window === 'undefined' ? '' : window.location.hash),
  );

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (next: Route) => {
    const target = buildHash(next);
    const current = window.location.hash;
    if (target === current || (target === '' && current === '')) return;
    if (target === '') {
      // 清除 hash 但保留页面位置
      history.pushState(
        '',
        document.title,
        window.location.pathname + window.location.search,
      );
      setRoute(next);
    } else {
      window.location.hash = target;
    }
  };

  return [route, navigate];
}
