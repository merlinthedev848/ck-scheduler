const fs = require('fs');
const files = ['api.pug', 'booking.pug', 'business.pug', 'general.pug', 'payments.pug'];
files.forEach(f => {
  const p = 'src/views/settings/' + f;
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/a\.list-group-item\.list-group-item-action(?:\.active)?\(href="\/settings\/payments"\) Payments\r?\n/, 
    'a.list-group-item.list-group-item-action' + (f === 'payments.pug' ? '.active' : '') + '(href="/settings/payments") Payments\n        a.list-group-item.list-group-item-action(href="/settings/notifications") Notifications\n');
  fs.writeFileSync(p, c);
});
console.log('Fixed navigation links');
