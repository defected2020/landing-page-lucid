import { ZONES } from './timezones';

// Roughly where the visitor is, from the browser's time zone alone: no
// permission prompt, no network request, nothing leaves the page. Accurate
// to the city a zone is named after, which is plenty at globe scale.

// Legacy names some browsers still report, mapped to current ones.
const ALIASES = {
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Ulan_Bator': 'Asia/Ulaanbaatar',
  'Asia/Istanbul': 'Europe/Istanbul',
  'Europe/Kiev': 'Europe/Kyiv',
  'Europe/Belfast': 'Europe/London',
  'America/Buenos_Aires': 'America/Argentina/Buenos_Aires',
  'America/Indianapolis': 'America/Indiana/Indianapolis',
  'America/Louisville': 'America/Kentucky/Louisville',
  'Atlantic/Faeroe': 'Atlantic/Faroe',
  'Australia/ACT': 'Australia/Sydney',
  'Australia/NSW': 'Australia/Sydney',
  'Pacific/Samoa': 'Pacific/Pago_Pago',
  'US/Eastern': 'America/New_York',
  'US/Central': 'America/Chicago',
  'US/Mountain': 'America/Denver',
  'US/Pacific': 'America/Los_Angeles',
  'US/Alaska': 'America/Anchorage',
  'US/Hawaii': 'Pacific/Honolulu',
  'Canada/Eastern': 'America/Toronto',
  'Canada/Pacific': 'America/Vancouver',
  GB: 'Europe/London',
  Japan: 'Asia/Tokyo',
  Singapore: 'Asia/Singapore',
  Hongkong: 'Asia/Hong_Kong',
  PRC: 'Asia/Shanghai',
  NZ: 'Pacific/Auckland',
};

// When a zone is missing from the table: its continent's typical latitude
// and the longitude its UTC offset implies.
const REGION_LAT = { Europe: 50, Africa: 5, Asia: 30, Australia: -30, Pacific: -15, Indian: -10, Atlantic: 30, America: 25 };

let table = null;
const lookup = (name) => {
  if (!table) {
    table = new Map();
    ZONES.split(';').forEach((entry) => {
      const [zone, coords] = entry.split(':');
      const [lat, lon] = coords.split(',').map(Number);
      table.set(zone, [lat, lon]);
    });
  }
  return table.get(name);
};

// { lat, lon } in degrees, or null when the zone says nothing useful (UTC,
// or a privacy browser that reports UTC to everyone).
export function locateVisitor() {
  let zone;
  try {
    // ?globe-tz=Asia/Tokyo previews the globe as seen from another zone.
    zone = new URLSearchParams(window.location.search).get('globe-tz');
    if (!zone) zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return null;
  }
  if (!zone || /^(UTC|UCT|GMT|Etc\/|Universal|Zulu)/.test(zone)) return null;
  const hit = lookup(ALIASES[zone] || zone);
  if (hit) return { lat: hit[0], lon: hit[1] };
  const lat = REGION_LAT[zone.split('/')[0]];
  if (lat === undefined) return null;
  const offsetHours = -new Date().getTimezoneOffset() / 60;
  return { lat, lon: Math.max(-180, Math.min(180, offsetHours * 15)) };
}
