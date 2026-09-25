import type { IconCategory } from '../types/icon'

/**
 * Source geometry for the built-in icon set (24×24 grid, 1.5px stroke).
 *
 * Each icon is drawn once as a list of path parts. `mockIcons.ts` turns every
 * drawing into up to three style variants:
 *   - body:   closed outer shape, filled at low opacity in the Bulk style
 *   - accent: secondary detail, faded in the Two-tone style
 *
 * This file is only used by the mock data layer. Real artwork exported from the
 * coordinator's Figma file can replace it without touching any UI code.
 */

export interface IconPart {
  d: string
  body?: boolean
  accent?: boolean
}

export interface IconDrawing {
  name: string
  category: IconCategory
  tags: string[]
  parts: IconPart[]
}

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`

const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - r * 2}a${r} ${r} 0 0 1 ${r} ${r}v${h - r * 2}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - r * 2)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - r * 2)}a${r} ${r} 0 0 1 ${r} ${-r}Z`

const CIRCLE_24 = circle(12, 12, 9)

export const ICON_DRAWINGS: IconDrawing[] = [
  // Finance
  {
    name: 'wallet',
    category: 'finance',
    tags: ['money', 'balance', 'account', 'purse'],
    parts: [
      { d: rect(3, 6.5, 18, 14, 3), body: true },
      { d: 'M6.5 6.5 15 3.6a1.5 1.5 0 0 1 2 1.4v1.5', accent: true },
      { d: 'M21 11.5h-3.5a2 2 0 0 0 0 4H21', accent: true },
    ],
  },
  {
    name: 'credit-card',
    category: 'finance',
    tags: ['card', 'payment', 'debit', 'visa', 'mastercard'],
    parts: [
      { d: rect(2.5, 5, 19, 14, 3), body: true },
      { d: 'M2.5 9.5h19' },
      { d: 'M6 15h3M12.5 15h2', accent: true },
    ],
  },
  {
    name: 'bank',
    category: 'finance',
    tags: ['building', 'branch', 'institution', 'office'],
    parts: [
      { d: 'M3 9.5 12 4l9 5.5H3Z', body: true },
      { d: 'M5.5 10v7M10 10v7M14 10v7M18.5 10v7', accent: true },
      { d: 'M3.5 17h17M2.5 20.5h19' },
    ],
  },
  {
    name: 'coin',
    category: 'finance',
    tags: ['money', 'currency', 'cash', 'dollar', 'price'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M12 6.5v11', accent: true },
      {
        d: 'M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2c-1.1 0-2-.4-2.5-1.2',
      },
    ],
  },
  {
    name: 'receipt',
    category: 'finance',
    tags: ['bill', 'invoice', 'transaction', 'statement'],
    parts: [
      { d: 'M5 3.5h14v17l-2.3-1.5-2.4 1.5-2.3-1.5-2.3 1.5-2.4-1.5L5 20.5Z', body: true },
      { d: 'M8.5 8h7M8.5 11.5h7M8.5 15h4', accent: true },
    ],
  },
  {
    name: 'trend-up',
    category: 'finance',
    tags: ['chart', 'growth', 'analytics', 'statistics', 'invest'],
    parts: [
      { d: rect(3, 3, 18, 18, 4), body: true },
      { d: 'M7 15l3-3.5 3 2L17 9' },
      { d: 'M14.5 9H17v2.5', accent: true },
    ],
  },
  {
    name: 'pie-chart',
    category: 'finance',
    tags: ['chart', 'report', 'analytics', 'budget'],
    parts: [
      { d: 'M11 4.5a8.5 8.5 0 1 0 8.5 8.5H11Z', body: true },
      { d: 'M14 2.5a7.5 7.5 0 0 1 7.5 7.5H14Z', accent: true },
    ],
  },

  // Security
  {
    name: 'shield-check',
    category: 'security',
    tags: ['protection', 'secure', 'verified', 'safe'],
    parts: [
      {
        d: 'M12 2.8 19.5 5.6v5.6c0 4.6-3.2 8.6-7.5 9.9-4.3-1.3-7.5-5.3-7.5-9.9V5.6Z',
        body: true,
      },
      { d: 'M9 12l2.1 2.1L15.2 10', accent: true },
    ],
  },
  {
    name: 'lock',
    category: 'security',
    tags: ['password', 'private', 'secure', 'closed'],
    parts: [
      { d: rect(4, 10, 16, 11, 3), body: true },
      { d: 'M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10' },
      { d: 'M12 14.5V17', accent: true },
    ],
  },
  {
    name: 'unlock',
    category: 'security',
    tags: ['open', 'access', 'unlocked'],
    parts: [
      { d: rect(4, 10, 16, 11, 3), body: true },
      { d: 'M7.5 10V7.5a4.5 4.5 0 0 1 8.7-1.6' },
      { d: 'M12 14.5V17', accent: true },
    ],
  },
  {
    name: 'key',
    category: 'security',
    tags: ['password', 'access', 'login', 'credentials'],
    parts: [
      { d: circle(8, 16, 4.5), body: true },
      { d: 'M11.2 12.8 20 4' },
      { d: 'M17 7l2.5 2.5M14.5 9.5l2 2', accent: true },
    ],
  },
  {
    name: 'eye',
    category: 'security',
    tags: ['view', 'show', 'visible', 'preview'],
    parts: [
      { d: 'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z', body: true },
      { d: circle(12, 12, 3), accent: true },
    ],
  },
  {
    name: 'eye-slash',
    category: 'security',
    tags: ['hide', 'hidden', 'invisible', 'private'],
    parts: [
      { d: 'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z', body: true },
      { d: circle(12, 12, 3), accent: true },
      { d: 'M4 4l16 16' },
    ],
  },

  // Communication
  {
    name: 'message',
    category: 'communication',
    tags: ['chat', 'comment', 'conversation', 'support'],
    parts: [
      {
        d: 'M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-8l-4.5 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 16V6A1.5 1.5 0 0 1 4 4.5Z',
        body: true,
      },
      { d: 'M7.5 9.5h9M7.5 13h5', accent: true },
    ],
  },
  {
    name: 'mail',
    category: 'communication',
    tags: ['email', 'envelope', 'inbox', 'letter'],
    parts: [
      { d: rect(2.5, 4.5, 19, 15, 3), body: true },
      { d: 'M6 9l6 4 6-4', accent: true },
    ],
  },
  {
    name: 'notification',
    category: 'communication',
    tags: ['bell', 'alert', 'reminder', 'alarm'],
    parts: [
      { d: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z', body: true },
      { d: 'M10 20.5a2.2 2.2 0 0 0 4 0', accent: true },
    ],
  },
  {
    name: 'send',
    category: 'communication',
    tags: ['share', 'transfer', 'paper-plane', 'submit'],
    parts: [
      { d: 'M3.5 11 20.5 3.5 13 20.5l-2.3-7.2Z', body: true },
      { d: 'M10.7 13.3 20.5 3.5', accent: true },
    ],
  },

  // Interface
  {
    name: 'home',
    category: 'interface',
    tags: ['house', 'dashboard', 'main', 'start'],
    parts: [
      { d: 'M3.5 10.5 12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19Z', body: true },
      { d: 'M9.5 20.5v-5a2.5 2.5 0 0 1 5 0v5', accent: true },
    ],
  },
  {
    name: 'search',
    category: 'interface',
    tags: ['find', 'magnifier', 'lookup', 'zoom'],
    parts: [
      { d: circle(11, 11, 7.5), body: true },
      { d: 'M16.5 16.5 21 21', accent: true },
    ],
  },
  {
    name: 'setting',
    category: 'interface',
    tags: ['sliders', 'preferences', 'controls', 'adjust'],
    parts: [
      { d: 'M4 7h9M17 7h3M4 17h3M11 17h9', accent: true },
      { d: circle(15, 7, 2), body: true },
      { d: circle(9, 17, 2), body: true },
    ],
  },
  {
    name: 'category',
    category: 'interface',
    tags: ['grid', 'apps', 'menu', 'dashboard'],
    parts: [
      { d: rect(3.5, 3.5, 7, 7, 2), body: true },
      { d: rect(13.5, 3.5, 7, 7, 2), accent: true },
      { d: rect(3.5, 13.5, 7, 7, 2), accent: true },
      { d: rect(13.5, 13.5, 7, 7, 2), body: true },
    ],
  },
  {
    name: 'add-circle',
    category: 'interface',
    tags: ['plus', 'create', 'new'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M12 8v8M8 12h8', accent: true },
    ],
  },
  {
    name: 'tick-circle',
    category: 'interface',
    tags: ['check', 'success', 'done', 'approved'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M8 12.2l2.8 2.8L16 9.5', accent: true },
    ],
  },
  {
    name: 'close-circle',
    category: 'interface',
    tags: ['cancel', 'remove', 'error', 'delete'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6', accent: true },
    ],
  },
  {
    name: 'info-circle',
    category: 'interface',
    tags: ['information', 'help', 'details', 'about'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M12 11v5.5M12 7.8v.2', accent: true },
    ],
  },
  {
    name: 'star',
    category: 'interface',
    tags: ['favourite', 'rating', 'bookmark'],
    parts: [
      {
        d: 'M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9Z',
        body: true,
      },
    ],
  },
  {
    name: 'heart',
    category: 'interface',
    tags: ['like', 'favourite', 'love'],
    parts: [
      {
        d: 'M12 20s-8.5-4.8-8.5-10.6A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 2.8C20.5 15.2 12 20 12 20Z',
        body: true,
      },
    ],
  },
  {
    name: 'calendar',
    category: 'interface',
    tags: ['date', 'schedule', 'event', 'month'],
    parts: [
      { d: rect(3.5, 5, 17, 15.5, 3), body: true },
      { d: 'M3.5 10h17' },
      { d: 'M8 3v4M16 3v4M8 14.5v.01M12 14.5v.01M16 14.5v.01', accent: true },
    ],
  },
  {
    name: 'clock',
    category: 'interface',
    tags: ['time', 'history', 'pending', 'schedule'],
    parts: [
      { d: CIRCLE_24, body: true },
      { d: 'M12 7.5V12l3 2', accent: true },
    ],
  },
  {
    name: 'filter',
    category: 'interface',
    tags: ['funnel', 'sort', 'refine'],
    parts: [{ d: 'M4 4.5h16l-6 7.5v6l-4 2v-8Z', body: true }],
  },
  {
    name: 'trash',
    category: 'interface',
    tags: ['delete', 'remove', 'bin', 'garbage'],
    parts: [
      { d: 'M5.5 7l1 12.2A1.5 1.5 0 0 0 8 20.5h8a1.5 1.5 0 0 0 1.5-1.3L18.5 7Z', body: true },
      { d: 'M3.5 7h17' },
      { d: 'M9 7V4.5h6V7M10 11v5.5M14 11v5.5', accent: true },
    ],
  },

  // Arrows
  {
    name: 'arrow-right',
    category: 'arrows',
    tags: ['next', 'forward', 'direction'],
    parts: [{ d: 'M4 12h16', accent: true }, { d: 'M14 6l6 6-6 6' }],
  },
  {
    name: 'arrow-left',
    category: 'arrows',
    tags: ['back', 'previous', 'direction'],
    parts: [{ d: 'M20 12H4', accent: true }, { d: 'M10 6l-6 6 6 6' }],
  },
  {
    name: 'arrow-up',
    category: 'arrows',
    tags: ['top', 'increase', 'direction'],
    parts: [{ d: 'M12 20V4', accent: true }, { d: 'M6 10l6-6 6 6' }],
  },
  {
    name: 'arrow-down',
    category: 'arrows',
    tags: ['bottom', 'decrease', 'direction'],
    parts: [{ d: 'M12 4v16', accent: true }, { d: 'M6 14l6 6 6-6' }],
  },
  {
    name: 'refresh',
    category: 'arrows',
    tags: ['reload', 'sync', 'update', 'repeat'],
    parts: [{ d: 'M20 12a8 8 0 1 1-2.3-5.6' }, { d: 'M20 3.5v4h-4', accent: true }],
  },
  {
    name: 'exchange',
    category: 'arrows',
    tags: ['swap', 'transfer', 'convert', 'currency'],
    parts: [
      { d: 'M4 8h15.5' },
      { d: 'M16 4.5 19.5 8 16 11.5', accent: true },
      { d: 'M20 16H4.5' },
      { d: 'M8 12.5 4.5 16 8 19.5', accent: true },
    ],
  },
  {
    name: 'export',
    category: 'arrows',
    tags: ['upload', 'share', 'send-out'],
    parts: [
      { d: 'M12 15V3.5M8 7.5l4-4 4 4', accent: true },
      { d: 'M4 14v4.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V14' },
    ],
  },
  {
    name: 'import',
    category: 'arrows',
    tags: ['download', 'save', 'receive'],
    parts: [
      { d: 'M12 3.5V15M8 11l4 4 4-4', accent: true },
      { d: 'M4 14v4.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V14' },
    ],
  },
  {
    name: 'external-link',
    category: 'arrows',
    tags: ['open', 'new-window', 'redirect'],
    parts: [
      { d: 'M13.5 4H20v6.5M20 4l-9 9', accent: true },
      { d: 'M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10' },
    ],
  },

  // Files
  {
    name: 'document',
    category: 'files',
    tags: ['file', 'page', 'paper', 'contract'],
    parts: [
      {
        d: 'M6.5 2.5H14l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1.5-1.5Z',
        body: true,
      },
      { d: 'M14 2.5v5h5' },
      { d: 'M8.5 12.5h7M8.5 16h5', accent: true },
    ],
  },
  {
    name: 'folder',
    category: 'files',
    tags: ['directory', 'archive', 'storage'],
    parts: [
      {
        d: 'M3 6.5a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
        body: true,
      },
      { d: 'M3 10.5h18', accent: true },
    ],
  },
  {
    name: 'clipboard',
    category: 'files',
    tags: ['copy', 'paste', 'task', 'list'],
    parts: [
      { d: rect(4.5, 4.5, 15, 17, 2.5), body: true },
      { d: rect(8.5, 2.5, 7, 4, 1.5) },
      { d: 'M8.5 12h7M8.5 15.5h4', accent: true },
    ],
  },
  {
    name: 'gallery',
    category: 'files',
    tags: ['image', 'photo', 'picture', 'media'],
    parts: [
      { d: rect(3, 4, 18, 16, 3), body: true },
      { d: circle(9, 9.5, 1.8), accent: true },
      { d: 'M3.5 17l5-4.5 4 3.5 3-2.5 5 4', accent: true },
    ],
  },

  // Users
  {
    name: 'user',
    category: 'users',
    tags: ['person', 'profile', 'account', 'client'],
    parts: [
      { d: circle(12, 8, 4), body: true },
      { d: 'M4.5 20.5c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6', accent: true },
    ],
  },
  {
    name: 'users',
    category: 'users',
    tags: ['people', 'group', 'team', 'clients'],
    parts: [
      { d: circle(9, 8, 3.5), body: true },
      { d: 'M2.5 20c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5' },
      { d: 'M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.5 2.6 3.5 5.2', accent: true },
    ],
  },
  {
    name: 'user-add',
    category: 'users',
    tags: ['invite', 'new-user', 'register', 'sign-up'],
    parts: [
      { d: circle(10, 8, 4), body: true },
      { d: 'M3 20.5c0-3.6 3.1-6 7-6 1.3 0 2.5.3 3.5.8' },
      { d: 'M18.5 14.5v6M15.5 17.5h6', accent: true },
    ],
  },
  {
    name: 'profile-circle',
    category: 'users',
    tags: ['avatar', 'account', 'user'],
    parts: [
      { d: circle(12, 12, 9.5), body: true },
      { d: circle(12, 10, 3), accent: true },
      { d: 'M6.2 18.6c1.3-1.9 3.4-3.1 5.8-3.1s4.5 1.2 5.8 3.1', accent: true },
    ],
  },

  // Devices
  {
    name: 'mobile',
    category: 'devices',
    tags: ['phone', 'smartphone', 'app', 'cell'],
    parts: [
      { d: rect(6, 2.5, 12, 19, 3), body: true },
      { d: 'M10.5 18h3', accent: true },
    ],
  },
  {
    name: 'laptop',
    category: 'devices',
    tags: ['computer', 'notebook', 'workstation'],
    parts: [
      { d: rect(4.5, 5, 15, 10.5, 2), body: true },
      { d: 'M2.5 19h19', accent: true },
    ],
  },
  {
    name: 'monitor',
    category: 'devices',
    tags: ['desktop', 'screen', 'display'],
    parts: [
      { d: rect(2.5, 3.5, 19, 13, 2.5), body: true },
      { d: 'M12 16.5v4M8 20.5h8', accent: true },
    ],
  },
  {
    name: 'scan',
    category: 'devices',
    tags: ['qr', 'barcode', 'scanner', 'camera'],
    parts: [
      {
        d: 'M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16',
      },
      { d: 'M3.5 12h17', accent: true },
    ],
  },
]
