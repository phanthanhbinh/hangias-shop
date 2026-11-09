export const PHONE_PREFIX = '+84';

export const TIME_SLOTS = ['09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00', '20:00–22:00'];

// Приводит ввод к виду +375 (29) 123-45-67.
// Скобки и дефисы ставим только перед следующей цифрой — иначе Backspace «упирается» в них.
export function formatPhone(input) {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('84')) digits = digits.slice(2);
  else if ('84'.startsWith(digits)) digits = ''; // стёрли часть префикса +84
  else if (digits.length === 10 && digits.startsWith('0')) digits = digits.slice(1); // вставили 0 29 123-45-67
  digits = digits.slice(0, 9);

  let result = PHONE_PREFIX;
  if (digits.length > 0) result += ` ${digits.slice(0, 2)}`;
  if (digits.length > 2) result += ` ${digits.slice(2, 5)}`;
  if (digits.length > 5) result += `${digits.slice(5, 7)}`;
  if (digits.length > 7) result += `${digits.slice(7, 9)}`;
  return result;
}

const toISODate = (d) => {
  const local = new Date(d);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
};

// Интервалы, на которые ещё можно заказать: на сегодня — только те, что не начались
export function availableSlots(date, now = new Date()) {
  if (date !== toISODate(now)) return TIME_SLOTS;
  return TIME_SLOTS.filter((slot) => Number(slot.slice(0, 2)) > now.getHours());
}

// Самая ранняя дата доставки: сегодня, а если все интервалы на сегодня прошли — завтра
export function minDeliveryDate(now = new Date()) {
  const today = toISODate(now);
  if (availableSlots(today, now).length > 0) return today;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toISODate(tomorrow);
}

const LETTERS = /\p{L}/gu;

export function validateCheckout(values, now = new Date()) {
  const errors = {};
  if ((values.name.match(LETTERS) ?? []).length < 2) errors.name = 'Nhập tên của bạn (tối thiểu 2 chữ cái)';
  // if (!/^\+375 \((25|29|33|44)\) \d{3}-\d{2}-\d{2}$/.test(values.phone)) {
  //   errors.phone = 'Введите номер полностью, код оператора 25, 29, 33 или 44';
  // }
  if (values.address.trim().length < 5) errors.address = 'Địa chỉ giao hàng (tối thiểu 5 ký tự)';
  if (!values.date) errors.date = 'Chọn ngày giao hàng';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) errors.date = 'Nhập ngày đầy đủ';
  else if (values.date < minDeliveryDate(now)) errors.date = 'Ngày không thể là trong quá khứ';
  if (!values.time) errors.time = 'Chọn khoảng thời gian giao hàng';
  else if (values.date && !availableSlots(values.date, now).includes(values.time)) {
    errors.time = 'Khoảng thời gian này đã trôi qua, vui lòng chọn khoảng thời gian khác';
  }
  if (values.card.length > 200) errors.card = 'Không được quá 200 ký tự';
  if (!values.payment) errors.payment = 'Chọn phương thức thanh toán';
  return errors;
}
