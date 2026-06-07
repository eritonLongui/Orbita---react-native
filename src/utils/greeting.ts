export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function getMissionNumber(createdAt?: string): number {
  if (!createdAt) return 1;
  const start = new Date(createdAt).getTime();
  const days = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)) + 1);
  return days;
}

const WEEKDAY_ABBR = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'] as const;
const MONTH_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'] as const;

export function formatHomeDateTime(date = new Date()) {
  const dayAbbr = WEEKDAY_ABBR[date.getDay()];
  const dayNum = date.getDate();
  const monthAbbr = MONTH_ABBR[date.getMonth()];

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const datePart = `${dayAbbr} ${dayNum} ${monthAbbr}`;
  const timePart = `${hours}:${minutes} ${meridiem}`;

  return {
    datePart,
    timePart,
    compactLabel: `${datePart} | ${timePart}`,
  };
}
